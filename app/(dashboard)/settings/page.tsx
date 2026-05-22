export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Settings
        </h2>
      </div>
      <div className="rounded-md border p-6 dark:border-slate-800">
        <p className="text-muted-foreground">Settings configuration will be available here.</p>
      </div>
    </div>
  );
}
