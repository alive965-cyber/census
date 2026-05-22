import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Map, Activity } from "lucide-react";

const stats = [
  {
    title: "Total Enumerators",
    value: "1,240",
    description: "+14 since last week",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Households Mapped",
    value: "84,320",
    description: "62% of target",
    icon: Home,
    color: "text-orange-500",
  },
  {
    title: "Active Wards",
    value: "42",
    description: "Out of 50 total",
    icon: Map,
    color: "text-green-500",
  },
  {
    title: "Sync Rate",
    value: "99.2%",
    description: "Offline data synced",
    icon: Activity,
    color: "text-purple-500",
  },
];

export function ProgressMonitor() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
