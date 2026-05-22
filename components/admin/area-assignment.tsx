'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(m => m.Polygon), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

// Mock ward boundaries
const mockWards = [
  {
    id: "ward-1",
    name: "Ward 42 - North",
    assignee: "Rahul Sharma",
    color: "#f97316", // Saffron
    positions: [
      [28.6139, 77.2090],
      [28.6150, 77.2120],
      [28.6120, 77.2150],
      [28.6100, 77.2100],
    ] as [number, number][],
  },
  {
    id: "ward-2",
    name: "Ward 15 - East",
    assignee: "Priya Patel",
    color: "#3b82f6", // Blue
    positions: [
      [28.6150, 77.2120],
      [28.6180, 77.2150],
      [28.6160, 77.2200],
      [28.6120, 77.2150],
    ] as [number, number][],
  }
];

export function AreaAssignment() {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 relative z-0 h-[400px]">
      <MapContainer 
        center={[28.6139, 77.2090] as [number, number]} 
        zoom={15} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mockWards.map(ward => (
          <Polygon 
            key={ward.id} 
            positions={ward.positions} 
            pathOptions={{ 
              color: ward.color, 
              fillColor: ward.color, 
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-slate-900">{ward.name}</h3>
                <p className="text-sm text-slate-600 mt-1">Assigned to: {ward.assignee}</p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm text-sm">
        <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Assignment Status</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Assigned & Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Assigned (Pending)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-slate-400 border-dashed"></div>
            <span className="text-slate-600 dark:text-slate-400">Unassigned</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
