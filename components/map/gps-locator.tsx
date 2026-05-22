"use client"

import { useMap } from "react-leaflet"
import { Button } from "@/components/ui/button"
import { LocateFixed } from "lucide-react"

export function GpsLocator() {
  const map = useMap()

  const handleLocate = () => {
    map.locate({ setView: false, enableHighAccuracy: true }).on("locationfound", function (e) {
      map.flyTo(e.latlng, 18)
    })
  }

  return (
    <div className="absolute top-4 right-4 z-[400]">
      <Button 
        variant="secondary" 
        size="icon" 
        onClick={handleLocate}
        className="shadow-md bg-background/90 hover:bg-background"
        title="Find my location"
      >
        <LocateFixed className="h-5 w-5 text-orange-500" />
      </Button>
    </div>
  )
}
