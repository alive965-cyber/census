"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { houseCensusSchema, type HouseCensusFormValues } from "@/utils/validators"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useHouses } from "@/hooks/use-houses"

interface HouseCensusFormProps {
  initialValues?: Partial<HouseCensusFormValues>
  onSuccess?: () => void
  latitude: number
  longitude: number
}

export function HouseCensusForm({ initialValues, onSuccess, latitude, longitude }: HouseCensusFormProps) {
  const { addHouse, loading, error } = useHouses()
  
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<HouseCensusFormValues>({
    resolver: zodResolver(houseCensusSchema) as any,
    defaultValues: {
      surveyStatus: "PENDING",
      male: 0,
      female: 0,
      children: 0,
      seniorCitizens: 0,
      totalPopulation: 1,
      latitude,
      longitude,
      ...initialValues,
    }
  })

  const onSubmit = async (data: HouseCensusFormValues) => {
    const res = await addHouse(data)
    if (res && onSuccess) {
      onSuccess()
    }
  }

  return (
    <Card className="p-4 sm:p-6 w-full max-w-2xl mx-auto backdrop-blur bg-background/80">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-destructive text-sm font-medium">{error}</div>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="houseNumber">House Number *</Label>
            <Input id="houseNumber" {...register("houseNumber")} aria-invalid={!!errors.houseNumber} />
            {errors.houseNumber && <span className="text-xs text-destructive">{errors.houseNumber.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="headOfFamily">Head of Family *</Label>
            <Input id="headOfFamily" {...register("headOfFamily")} aria-invalid={!!errors.headOfFamily} />
            {errors.headOfFamily && <span className="text-xs text-destructive">{errors.headOfFamily.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" {...register("mobile")} aria-invalid={!!errors.mobile} />
            {errors.mobile && <span className="text-xs text-destructive">{errors.mobile.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="surveyStatus">Survey Status *</Label>
            <Controller
              name="surveyStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="surveyStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.surveyStatus && <span className="text-xs text-destructive">{errors.surveyStatus.message}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input id="address" {...register("address")} aria-invalid={!!errors.address} />
          {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalPopulation">Total *</Label>
            <Input type="number" id="totalPopulation" {...register("totalPopulation")} aria-invalid={!!errors.totalPopulation} />
            {errors.totalPopulation && <span className="text-xs text-destructive">{errors.totalPopulation.message}</span>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="male">Male *</Label>
            <Input type="number" id="male" {...register("male")} aria-invalid={!!errors.male} />
            {errors.male && <span className="text-xs text-destructive">{errors.male.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="female">Female *</Label>
            <Input type="number" id="female" {...register("female")} aria-invalid={!!errors.female} />
            {errors.female && <span className="text-xs text-destructive">{errors.female.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="children">Children *</Label>
            <Input type="number" id="children" {...register("children")} aria-invalid={!!errors.children} />
            {errors.children && <span className="text-xs text-destructive">{errors.children.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniorCitizens">Seniors *</Label>
            <Input type="number" id="seniorCitizens" {...register("seniorCitizens")} aria-invalid={!!errors.seniorCitizens} />
            {errors.seniorCitizens && <span className="text-xs text-destructive">{errors.seniorCitizens.message}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" {...register("notes")} />
          {errors.notes && <span className="text-xs text-destructive">{errors.notes.message}</span>}
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white">
            {loading ? "Saving..." : "Save Census Record"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
