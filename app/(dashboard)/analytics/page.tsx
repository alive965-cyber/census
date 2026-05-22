import { StatsCards } from "@/components/dashboard/stats-cards"
import { PopulationChart } from "@/components/dashboard/population-chart"
import { WardChart } from "@/components/dashboard/ward-chart"
import { DailyProgress } from "@/components/dashboard/daily-progress"
import { CompletionRing } from "@/components/dashboard/completion-ring"

export default function AnalyticsDashboardPage() {
  // Mock Data (to be replaced with actual backend calls)
  
  const statsData = {
    totalHouses: 1450,
    totalPopulation: 5800,
    male: 2950,
    female: 2850,
    children: 1200,
    seniors: 650,
    completionRate: 72,
  }

  const populationData = [
    { category: "Male", count: 2950 },
    { category: "Female", count: 2850 },
    { category: "Children", count: 1200 },
    { category: "Seniors", count: 650 },
  ]

  const wardData = [
    { name: "Ward 1", surveyed: 400, pending: 120 },
    { name: "Ward 2", surveyed: 300, pending: 200 },
    { name: "Ward 3", surveyed: 450, pending: 50 },
    { name: "Ward 4", surveyed: 300, pending: 180 },
  ]

  const dailyProgressData = [
    { date: "Mon", completed: 45 },
    { date: "Tue", completed: 52 },
    { date: "Wed", completed: 89 },
    { date: "Thu", completed: 70 },
    { date: "Fri", completed: 95 },
    { date: "Sat", completed: 120 },
    { date: "Sun", completed: 110 },
  ]

  const completionRingData = [
    { name: "Surveyed", value: 1450, color: "#10b981" }, // Emerald 500
    { name: "Pending", value: 450, color: "#f59e0b" },   // Amber 500
    { name: "Incomplete", value: 80, color: "#3b82f6" }, // Blue 500
    { name: "Locked", value: 20, color: "#ef4444" },     // Red 500
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Analytics Dashboard
        </h2>
      </div>

      <StatsCards {...statsData} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <DailyProgress data={dailyProgressData} />
        </div>
        <div className="lg:col-span-3">
          <CompletionRing data={completionRingData} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PopulationChart data={populationData} />
        <WardChart data={wardData} />
      </div>
    </div>
  )
}
