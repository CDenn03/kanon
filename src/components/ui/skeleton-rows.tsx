"use client";

interface SkeletonRowsProps {
  n?: number;
  colCount?: number;
}

/**
 * SkeletonRows — loading placeholder rows for tables.
 * Renders n rows with animated pulse skeletons.
 */
export function SkeletonRows({ n = 8, colCount = 3 }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <tr key={i} className="border-t border-border">
          <td className="px-4 py-3">
            <span className="block h-4 w-4 rounded-sm bg-bg-secondary" />
          </td>
          <td className="px-4 py-3">
            <span className="flex items-center gap-3">
              <span className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-bg-secondary" />
              <span className="flex-1">
                <span
                  className="block h-3 animate-pulse rounded bg-bg-secondary"
                  style={{ width: `${55 + ((i * 7) % 30)}%` }}
                />
                <span
                  className="mt-1.5 block h-2.5 animate-pulse rounded bg-bg-secondary"
                  style={{ width: `${40 + ((i * 11) % 25)}%` }}
                />
              </span>
            </span>
          </td>
          {Array.from({ length: colCount }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <span
                className="block h-3 animate-pulse rounded bg-bg-secondary"
                style={{ width: `${45 + ((c * 13 + i * 5) % 35)}%` }}
              />
            </td>
          ))}
          <td className="px-4 py-3" />
        </tr>
      ))}
    </>
  );
}
