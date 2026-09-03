// ── Form primitives ────────────────────────────────────────────
export { Field, controlBase, controlClasses } from "./field";
export { Button } from "./button";
export { Input } from "./input";
export { Textarea } from "./textarea";
export { MoneyInput } from "./money-input";
export { SearchCombobox } from "./search-combobox";
export type { ComboboxOption } from "./search-combobox";
export { Tabs } from "./tabs";
export { MonthGrid, DatePicker } from "./calendar";
export { DateRangePicker } from "./date-range-picker";
export { Toast, useToasts } from "./toast";
export type { ToastData } from "./toast";
export { HoldToConfirm } from "./hold-to-confirm";
export { ConfirmDialog } from "./confirm-dialog";
export { Switch, SwitchRow } from "./switch";
export type { SwitchProps } from "./switch";

// ── Table primitives ───────────────────────────────────────────
export { Badge } from "./badge";
export { Checkbox } from "./checkbox";
export { SortHeader } from "./sort-header";
export { StatCard } from "./stat-card";
export { ExceptionStrip } from "./exception-strip";
export { Banner } from "./banner";
export { Blank } from "./blank";
export { SkeletonRows } from "./skeleton-rows";
export { Pagination } from "./pagination";
export type { PaginationProps, PaginationMeta } from "./pagination";

// ── Display / content ──────────────────────────────────────────
export { Avatar } from "./avatar";
export type { AvatarProps } from "./avatar";

export { Card, CardHeader, CardBody, CardFooter } from "./card";
export type { CardHeaderProps } from "./card";

export { Breadcrumb } from "./breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./breadcrumb";

export { PageHeader } from "./page-header";
export type { PageHeaderProps } from "./page-header";

export { Tooltip } from "./tooltip";
export type { TooltipProps } from "./tooltip";

export { BackButton } from "./back-button";

export { TableOfContents } from "./table-of-contents";
export type { TocItem } from "./table-of-contents";

export { CommandPalette, useCommandPalette } from "./command-palette";
export type { CommandItem } from "./command-palette";

// ── Tier 1: overlays, inputs, data ─────────────────────────────
export { Dialog } from "./dialog";
export { Drawer } from "./drawer";
export { Select } from "./select";
export type { SelectOption } from "./select";
export { RadioGroup } from "./radio-group";
export type { RadioOption } from "./radio-group";
export { DataTable } from "./data-table";
export type { DataTableColumn } from "./data-table";

// ── Tier 2: feedback, layout, forms ────────────────────────────
export { Alert } from "./alert";
export { Progress } from "./progress";
export { Accordion } from "./accordion";
export type { AccordionItem } from "./accordion";
export { Slider } from "./slider";
export { EmptyState } from "./empty-state";

// ── Tier 3: primitives ─────────────────────────────────────────
export { Popover } from "./popover";
export { Separator } from "./separator";
export { Kbd } from "./kbd";
export { Spinner } from "./spinner";
export { ButtonGroup, Toolbar } from "./button-group";
export type { ButtonGroupOption } from "./button-group";
export { Chip, TagInput } from "./chip";

// ── Overlay / menu ─────────────────────────────────────────────
export {
  Menu, MenuTrigger, MenuContent,
  MenuItem, MenuCheckboxItem, MenuSeparator, MenuLabel,
} from "./menu";
export type {
  MenuProps, MenuContentProps, MenuItemProps, MenuCheckboxItemProps,
} from "./menu";

// ── Shell chrome ───────────────────────────────────────────────
export {
  Sidebar, SidebarNav, SidebarSection, SidebarItem, SidebarGroup,
  SidebarFooter, SidebarAccount, SidebarLogoutButton,
} from "./sidebar";
export type { SidebarProps, SidebarItemProps, SidebarGroupProps } from "./sidebar";

export { Navbar } from "./navbar";
export type { NavbarProps } from "./navbar";
