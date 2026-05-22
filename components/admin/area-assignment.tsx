'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(m => m.Polygon), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

export function AreaAssignment() {
  const [wards, setWards] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchWards = async () => {
      const { data } = await supabase.from('wards').select('*, users(name)');
      if (data) setWards(data);
    };
    fetchWards();
  }, [supabase]);

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 relative z-0 h-[400px]">
      <MapContainer 
        center={[28.6139, 77.2090] as [number, number]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        
        {wards.map(ward => (
          <Polygon 
            key={ward.id} 
            positions={ward.boundary?.positions || []} 
            pathOptions={{ 
              color: ward.users ? '#f97316' : '#94a3b8', 
              fillColor: ward.users ? '#f97316' : '#94a3b8', 
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-slate-900">{ward.name || ward.ward_number}</h3>
                <p className="text-sm text-slate-600 mt-1">Assigned to: {ward.users?.name || 'Unassigned'}</p>
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
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-slate-600 dark:text-slate-400">Unassigned</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
