import { AreaAssignment } from "@/components/admin/area-assignment";
import { ProgressMonitor } from "@/components/admin/progress-monitor";
import { WorkerTable } from "@/components/admin/worker-table";
import { ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-orange-500" />
          Admin Control Center
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ProgressMonitor />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50 backdrop-blur-sm p-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Area Assignment Map</h2>
          <AreaAssignment />
        </div>
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50 backdrop-blur-sm p-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Enumerators Directory</h2>
          <WorkerTable />
        </div>
      </div>
    </div>
  );
}
