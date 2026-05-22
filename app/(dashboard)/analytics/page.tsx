"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PopulationChart } from "@/components/dashboard/population-chart"
import { WardChart } from "@/components/dashboard/ward-chart"
import { DailyProgress } from "@/components/dashboard/daily-progress"
import { CompletionRing } from "@/components/dashboard/completion-ring"
import { useHouses } from "@/hooks/use-houses"
import { HouseCensusFormValues } from "@/utils/validators"

export default function AnalyticsDashboardPage() {
  const { fetchHouses, loading } = useHouses()
  const [houses, setHouses] = useState<(HouseCensusFormValues & { id: string, created_at: string })[]>([])

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHouses()
      if (data) setHouses(data as any)
    }
    loadData()
  }, [fetchHouses])

  // Aggregation Logic for Real Data
  const totalHouses = houses.length
  const totalPopulation = houses.reduce((sum, h) => sum + (h.totalPopulation || 0), 0)
  const male = houses.reduce((sum, h) => sum + (h.male || 0), 0)
  const female = houses.reduce((sum, h) => sum + (h.female || 0), 0)
  const children = houses.reduce((sum, h) => sum + (h.children || 0), 0)
  const seniors = houses.reduce((sum, h) => sum + (h.seniorCitizens || 0), 0)

  const completedSurveys = houses.filter(h => h.surveyStatus === "COMPLETED").length
  const completionRate = totalHouses > 0 ? Math.round((completedSurveys / totalHouses) * 100) : 0

  const statsData = { totalHouses, totalPopulation, male, female, children, seniors, completionRate }

  const populationData = [
    { category: "Male", count: male },
    { category: "Female", count: female },
    { category: "Children", count: children },
    { category: "Seniors", count: seniors },
  ]

  // Group by Status
  const pending = houses.filter(h => h.surveyStatus === "PENDING").length
  const inProgress = houses.filter(h => h.surveyStatus === "IN_PROGRESS").length

  const completionRingData = [
    { name: "Completed", value: completedSurveys || 1, color: "#10b981" },
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "In Progress", value: inProgress, color: "#3b82f6" },
  ]

  // Dummy Ward/Daily data as placeholders until Ward table is fully linked
  const wardData = [
    { name: "Ward 1", surveyed: completedSurveys, pending: pending },
  ]
  const dailyProgressData = [
    { date: "Today", completed: completedSurveys },
  ]

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Analytics...</div>

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
