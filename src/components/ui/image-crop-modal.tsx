"use client";

import { useRef, useState, useEffect, useCallback, type PointerEvent, type KeyboardEvent } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog } from "./dialog";
import { Button } from "./button";

/** A crop rectangle in canvas pixels. */
interface CropBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ImageCropModalProps {
  open: boolean;
  /** Object URL / URL of the image to crop. The caller owns revoking object URLs. */
  imageSrc: string;
  /**
   * Fixed aspect ratio (width / height) the crop is locked to — e.g. 1 for a
   * square/avatar, 16/9 for a cover. Omit for a free-form crop.
   */
  aspect?: number;
  /** Whether to preview the crop as a circle (avatars). Visual only. */
  circular?: boolean;
  /** Minimum exported width in source pixels; smaller crops are blocked. */
  minWidth?: number;
  /** Output MIME type. Defaults to image/png (lossless). */
  outputType?: string;
  /** Output file name. Defaults to "cropped.png". */
  outputName?: string;
  /** Called with the cropped image as a File when the user confirms. */
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

const CANVAS_MAX_W = 560;
const HANDLE = 14; // px — Fitts's Law: a comfortably large grab target
const MIN_BOX = 48; // px on canvas
const KEY_STEP = 4; // px per arrow press (×5 with Shift)

/**
 * ImageCropModal — an accessible, aspect-aware image cropper. Drag inside the
 * box to reposition, drag the handle (or use the keyboard) to resize; the crop
 * can be locked to an aspect ratio and previewed as a circle. Confirms with the
 * cropped image as a File.
 *
 * Accessibility & UX (grounded in the Mathesis UX books):
 * - Pointer Events unify mouse + touch; the box is keyboard-operable
 *   (arrows move, Shift+arrows resize) so it isn't gesture-only (Fitts's Law,
 *   mobile-patterns).
 * - The resize handle is a large, visible target (Fitts's Law).
 * - Validity + dimensions are announced via an aria-live region with an icon +
 *   text, never color alone (color-perception / accessibility).
 * - Only essential controls are shown (progressive disclosure).
 */
export function ImageCropModal({
  open,
  imageSrc,
  aspect,
  circular,
  minWidth = 0,
  outputType = "image/png",
  outputName = "cropped.png",
  onConfirm,
  onCancel,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 });
  const [scale, setScale] = useState(1); // source px per canvas px
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const drag = useRef<{ mode: "move" | "resize"; px: number; py: number; box: CropBox } | null>(null);

  const outWidth = Math.round(crop.w * scale);
  const outHeight = Math.round(crop.h * scale);
  const tooSmall = minWidth > 0 && outWidth < minWidth;

  // Clamp a box to canvas bounds while (optionally) preserving aspect.
  const clampBox = useCallback(
    (box: CropBox, cw: number, ch: number): CropBox => {
      let { x, y, w, h } = box;
      w = Math.max(MIN_BOX, w);
      h = aspect ? w / aspect : Math.max(MIN_BOX, h);
      if (w > cw) { w = cw; h = aspect ? w / aspect : h; }
      if (h > ch) { h = ch; w = aspect ? h * aspect : w; }
      x = Math.max(0, Math.min(x, cw - w));
      y = Math.max(0, Math.min(y, ch - h));
      return { x, y, w, h };
    },
    [aspect]
  );

  // Load image + set initial centered crop.
  useEffect(() => {
    if (!open || !imageSrc) return;
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      const cw = Math.min(img.naturalWidth, CANVAS_MAX_W);
      const s = img.naturalWidth / cw;
      const ch = Math.round(img.naturalHeight / s);
      setScale(s);
      setCanvasSize({ w: cw, h: ch });
      // Largest aspect-correct box that fits, centered.
      let w = cw;
      let h = aspect ? w / aspect : Math.round(ch * 0.8);
      if (h > ch) { h = ch; w = aspect ? h * aspect : w; }
      setCrop({ x: Math.round((cw - w) / 2), y: Math.round((ch - h) / 2), w, h });
    };
    img.src = imageSrc;
  }, [open, imageSrc, aspect]);

  // Draw the canvas: image, dim overlay, crop border/mask, grid, handle.
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || crop.w === 0) return;
    const { w: cw, h: ch } = canvasSize;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);

    // Dim outside the crop.
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, cw, crop.y);
    ctx.fillRect(0, crop.y + crop.h, cw, ch - crop.y - crop.h);
    ctx.fillRect(0, crop.y, crop.x, crop.h);
    ctx.fillRect(crop.x + crop.w, crop.y, cw - crop.x - crop.w, crop.h);

    // Circular mask preview: clear a circle within the box.
    if (circular) {
      ctx.save();
      ctx.beginPath();
      const r = Math.min(crop.w, crop.h) / 2;
      ctx.arc(crop.x + crop.w / 2, crop.y + crop.h / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Crop border.
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x + 1, crop.y + 1, crop.w - 2, crop.h - 2);

    // Rule-of-thirds grid.
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + (crop.w / 3) * i, crop.y);
      ctx.lineTo(crop.x + (crop.w / 3) * i, crop.y + crop.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + (crop.h / 3) * i);
      ctx.lineTo(crop.x + crop.w, crop.y + (crop.h / 3) * i);
      ctx.stroke();
    }

    // Resize handle (bottom-right), large for easy grabbing.
    ctx.fillStyle = "#fff";
    ctx.fillRect(crop.x + crop.w - HANDLE, crop.y + crop.h - HANDLE, HANDLE, HANDLE);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(crop.x + crop.w - HANDLE, crop.y + crop.h - HANDLE, HANDLE, HANDLE);
  }, [crop, canvasSize, circular]);

  const toCanvas = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const p = toCanvas(e);
    const onHandle =
      p.x >= crop.x + crop.w - HANDLE - 4 &&
      p.x <= crop.x + crop.w + 4 &&
      p.y >= crop.y + crop.h - HANDLE - 4 &&
      p.y <= crop.y + crop.h + 4;
    const inside = p.x >= crop.x && p.x <= crop.x + crop.w && p.y >= crop.y && p.y <= crop.y + crop.h;
    if (!onHandle && !inside) return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    drag.current = { mode: onHandle ? "resize" : "move", px: p.x, py: p.y, box: crop };
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const p = toCanvas(e);
    const { mode, px, py, box } = drag.current;
    const { w: cw, h: ch } = canvasSize;
    if (mode === "resize") {
      const nextW = box.w + (p.x - px);
      setCrop(clampBox({ ...box, w: nextW, h: aspect ? nextW / aspect : box.h + (p.y - py) }, cw, ch));
    } else {
      setCrop(clampBox({ ...box, x: box.x + (p.x - px), y: box.y + (p.y - py) }, cw, ch));
    }
  };

  const endDrag = (e: PointerEvent<HTMLCanvasElement>) => {
    drag.current = null;
    canvasRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const { w: cw, h: ch } = canvasSize;
    const step = e.shiftKey ? KEY_STEP * 5 : KEY_STEP;
    const resize = e.altKey; // Alt+arrows resize, arrows move
    let next: CropBox | null = null;
    if (e.key === "ArrowLeft") next = resize ? { ...crop, w: crop.w - step } : { ...crop, x: crop.x - step };
    else if (e.key === "ArrowRight") next = resize ? { ...crop, w: crop.w + step } : { ...crop, x: crop.x + step };
    else if (e.key === "ArrowUp") next = resize ? { ...crop, w: crop.w - step } : { ...crop, y: crop.y - step };
    else if (e.key === "ArrowDown") next = resize ? { ...crop, w: crop.w + step } : { ...crop, y: crop.y + step };
    if (!next) return;
    e.preventDefault();
    if (resize && aspect) next.h = next.w / aspect;
    setCrop(clampBox(next, cw, ch));
  };

  const confirm = () => {
    const img = imgRef.current;
    if (!img || tooSmall) return;
    const sx = crop.x * scale;
    const sy = crop.y * scale;
    const sw = crop.w * scale;
    const sh = crop.h * scale;
    const out = document.createElement("canvas");
    out.width = Math.round(sw);
    out.height = Math.round(sh);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
    out.toBlob(
      (blob) => {
        if (blob) onConfirm(new File([blob], outputName, { type: outputType }));
      },
      outputType,
      0.95
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      size="lg"
      title="Crop image"
      description={
        aspect
          ? "Drag to reposition, drag the handle to resize. The crop keeps a fixed shape."
          : "Drag to reposition, drag the handle to resize."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={tooSmall}>
            Use image
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-center overflow-auto rounded-lg bg-surface-dark p-2" style={{ maxHeight: 420 }}>
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="slider"
            aria-label="Crop area — arrow keys move, Alt+arrows resize"
            aria-valuetext={`${outWidth} by ${outHeight} pixels`}
            className="max-w-full touch-none rounded outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ cursor: drag.current?.mode === "resize" ? "nwse-resize" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
          />
        </div>

        <p
          aria-live="polite"
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium tabular-nums",
            tooSmall ? "text-error" : "text-text-secondary"
          )}
        >
          {tooSmall ? (
            <>
              <AlertTriangle size={13} aria-hidden />
              Crop is {outWidth}px wide — needs at least {minWidth}px.
            </>
          ) : (
            <>
              <Check size={13} className="text-accent" aria-hidden />
              {outWidth} × {outHeight} px
            </>
          )}
        </p>
      </div>
    </Dialog>
  );
}
