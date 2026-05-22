"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { HouseMarker } from "./house-marker"
import { GpsLocator } from "./gps-locator"
import { useHouses } from "@/hooks/use-houses"
import { HouseCensusFormValues } from "@/utils/validators"
import { HouseCensusForm } from "@/components/forms/house-census-form"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"

// Fix for default marker icons in leaflet being broken in Next.js
import L from "leaflet"
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/"

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function CensusMap() {
  const { fetchHouses, loading } = useHouses()
  const [houses, setHouses] = useState<(HouseCensusFormValues & { id: string })[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null)
  
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHouses()
      if (data) setHouses(data as any)
    }
    loadData()
  }, [fetchHouses])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setIsFormOpen(true)
  }

  const handleFormSuccess = async () => {
    setIsFormOpen(false)
    const data = await fetchHouses()
    if (data) setHouses(data as any)
  }

  // Default to central India
  const defaultCenter: [number, number] = [21.1458, 79.0882]

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen">
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        <GpsLocator />
        
        {houses.map((house) => (
          <HouseMarker 
            key={house.id} 
            house={house} 
          />
        ))}
      </MapContainer>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Census Record</DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <HouseCensusForm 
              latitude={selectedLocation.lat}
              longitude={selectedLocation.lng}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
