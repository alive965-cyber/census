import { createClient } from "@/lib/supabase/client"
import { useState, useCallback } from "react"
import { HouseCensusFormValues } from "@/utils/validators"

export function useHouses() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchHouses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("houses").select("*")
      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const addHouse = async (houseData: HouseCensusFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("houses").insert([houseData]).select().single()
      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateHouse = async (id: string, houseData: Partial<HouseCensusFormValues>) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("houses").update(houseData).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchHouses,
    addHouse,
    updateHouse,
    loading,
    error,
  }
}
