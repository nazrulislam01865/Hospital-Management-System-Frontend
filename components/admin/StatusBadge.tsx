import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Inactive: "bg-slate-50 text-slate-700 ring-slate-200",
  Blocked: "bg-red-50 text-red-700 ring-red-200",

  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Approved: "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",

  Available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Occupied: "bg-blue-50 text-blue-700 ring-blue-200",
  Maintenance: "bg-red-50 text-red-700 ring-red-200",

  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Unpaid: "bg-red-50 text-red-700 ring-red-200",
  Partial: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        styles[status] ?? "bg-slate-50 text-slate-700 ring-slate-200",
      )}
    >
      {status}
    </span>
  );
}