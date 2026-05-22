import { z } from "zod"

export const houseCensusSchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  headOfFamily: z.string().min(2, "Head of family name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits").optional().or(z.literal("")),
  totalPopulation: z.coerce.number().min(1, "Total population must be at least 1"),
  male: z.coerce.number().min(0),
  female: z.coerce.number().min(0),
  children: z.coerce.number().min(0),
  seniorCitizens: z.coerce.number().min(0),
  address: z.string().min(5, "Address is required"),
  notes: z.string().optional(),
  surveyStatus: z.enum(["PENDING", "COMPLETED", "IN_PROGRESS"]).default("PENDING"),
  latitude: z.number({ message: "Latitude is required" }),
  longitude: z.number({ message: "Longitude is required" }),
}).refine((data) => {
  return data.male + data.female === data.totalPopulation
}, {
  message: "Male and female population must equal total population",
  path: ["totalPopulation"],
}).refine((data) => {
  return data.children <= data.totalPopulation
}, {
  message: "Children cannot exceed total population",
  path: ["children"],
}).refine((data) => {
  return data.seniorCitizens <= data.totalPopulation
}, {
  message: "Senior citizens cannot exceed total population",
  path: ["seniorCitizens"],
})

export type HouseCensusFormValues = z.infer<typeof houseCensusSchema>
