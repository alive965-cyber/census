"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { HouseCensusFormValues } from "@/utils/validators"

// Workaround for default leaflet markers
const createCustomIcon = (status: HouseCensusFormValues["surveyStatus"]) => {
  let color = "#ef4444" // PENDING (Red)
  if (status === "COMPLETED") color = "#22c55e" // Green
  else if (status === "IN_PROGRESS") color = "#eab308" // Yellow

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3" fill="white" />
    </svg>
  `

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="width: 24px; height: 24px; drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))">${svgIcon}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

interface HouseMarkerProps {
  house: HouseCensusFormValues & { id: string }
  onClick?: (house: HouseCensusFormValues & { id: string }) => void
}

export function HouseMarker({ house, onClick }: HouseMarkerProps) {
  return (
    <Marker 
      position={[house.latitude, house.longitude]} 
      icon={createCustomIcon(house.surveyStatus)}
      eventHandlers={{
        click: () => onClick && onClick(house)
      }}
    >
      <Popup className="custom-popup">
        <div className="p-1 min-w-[150px]">
          <h3 className="font-semibold text-sm">House: {house.houseNumber}</h3>
          <p className="text-xs text-muted-foreground mb-2">{house.headOfFamily}</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span className="font-medium">Status:</span>
            <span className={`
              ${house.surveyStatus === 'COMPLETED' ? 'text-green-600' : ''}
              ${house.surveyStatus === 'IN_PROGRESS' ? 'text-yellow-600' : ''}
              ${house.surveyStatus === 'PENDING' ? 'text-red-600' : ''}
            `}>{house.surveyStatus}</span>
            <span className="font-medium">Population:</span>
            <span>{house.totalPopulation}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
