import { createClient } from "@/lib/supabase/client"
import { useState, useCallback } from "react"
import { HouseCensusFormValues } from "@/utils/validators"

// Map camelCase form fields → snake_case DB columns
function formToDb(data: HouseCensusFormValues) {
  return {
    house_number: data.houseNumber,
    head_of_family: data.headOfFamily,
    contact_number: data.mobile || null,
    address: data.address,
    total_population: data.totalPopulation,
    male: data.male,
    female: data.female,
    children: data.children,
    senior_citizens: data.seniorCitizens,
    notes: data.notes || null,
    survey_status: data.surveyStatus,
    latitude: data.latitude,
    longitude: data.longitude,
    location: { lat: data.latitude, lng: data.longitude },
  }
}

// Map snake_case DB rows → camelCase for the frontend
function dbToForm(row: any): HouseCensusFormValues & { id: string; created_at: string } {
  return {
    id: row.id,
    created_at: row.created_at,
    houseNumber: row.house_number || "",
    headOfFamily: row.head_of_family || "",
    mobile: row.contact_number || "",
    address: row.address || "",
    totalPopulation: row.total_population || 0,
    male: row.male || 0,
    female: row.female || 0,
    children: row.children || 0,
    seniorCitizens: row.senior_citizens || 0,
    notes: row.notes || "",
    surveyStatus: row.survey_status || "PENDING",
    latitude: row.latitude || row.location?.lat || 0,
    longitude: row.longitude || row.location?.lng || 0,
  }
}

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
      return (data || []).map(dbToForm)
    } catch (err: any) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const addHouse = async (houseData: HouseCensusFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const dbData = formToDb(houseData)
      const { data, error } = await supabase.from("houses").insert([dbData]).select().single()
      if (error) throw error
      return dbToForm(data)
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
      const dbData = formToDb(houseData as HouseCensusFormValues)
      const { data, error } = await supabase.from("houses").update(dbData).eq("id", id).select().single()
      if (error) throw error
      return dbToForm(data)
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

