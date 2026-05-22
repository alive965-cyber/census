import { createClient } from "@/lib/supabase/client"
import { useState, useCallback } from "react"

export function useSurveys() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchSurveys = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("surveys").select("*")
      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const getSurveyStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Aggregate data logic
      const { data, error } = await supabase.from("houses").select("totalPopulation, male, female, children, seniorCitizens, surveyStatus")
      if (error) throw error
      
      const stats = data.reduce((acc, curr) => {
        acc.totalPopulation += curr.totalPopulation || 0
        acc.male += curr.male || 0
        acc.female += curr.female || 0
        acc.children += curr.children || 0
        acc.seniorCitizens += curr.seniorCitizens || 0
        if (curr.surveyStatus === "COMPLETED") acc.completedSurveys++
        if (curr.surveyStatus === "PENDING") acc.pendingSurveys++
        return acc
      }, {
        totalPopulation: 0,
        male: 0,
        female: 0,
        children: 0,
        seniorCitizens: 0,
        completedSurveys: 0,
        pendingSurveys: 0,
        totalHouses: data.length
      })

      return stats
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    fetchSurveys,
    getSurveyStats,
    loading,
    error,
  }
}
