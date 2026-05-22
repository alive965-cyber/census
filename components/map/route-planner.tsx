'use client';

import { useEffect, useRef } from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Haversine distance in meters between two lat/lng points.
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface RoutableHouse {
  id: string;
  house_number: string;
  address: string;
  lat: number;
  lng: number;
  status: string;
}

interface RoutePlannerProps {
  currentLocation: { lat: number; lng: number } | null;
  houses: RoutableHouse[];
  onNavigate?: (house: RoutableHouse) => void;
}

/**
 * Find the nearest unsurveyed house from the current location.
 */
function findNearestUnsurveyed(
  currentLat: number,
  currentLng: number,
  houses: RoutableHouse[]
): { house: RoutableHouse; distance: number } | null {
  const unsurveyed = houses.filter((h) => h.status === 'pending' || h.status === 'in_progress');
  if (unsurveyed.length === 0) return null;

  let nearest: RoutableHouse | null = null;
  let minDist = Infinity;

  for (const house of unsurveyed) {
    const dist = haversineDistance(currentLat, currentLng, house.lat, house.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = house;
    }
  }

  return nearest ? { house: nearest, distance: minDist } : null;
}

/**
 * Format distance for display (m or km).
 */
function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function RoutePlanner({ currentLocation, houses, onNavigate }: RoutePlannerProps) {
  const nearest = currentLocation
    ? findNearestUnsurveyed(currentLocation.lat, currentLocation.lng, houses)
    : null;

  const uncompletedCount = houses.filter(
    (h) => h.status === 'pending' || h.status === 'in_progress'
  ).length;

  if (!currentLocation) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/90 backdrop-blur-xl p-4 shadow-lg">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 rounded-lg bg-muted/50">
            <Navigation size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Route Planner</p>
            <p className="text-xs">Enable GPS to find the nearest unsurveyed house</p>
          </div>
        </div>
      </div>
    );
  }

  if (uncompletedCount === 0) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <MapPin size={18} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">All Done!</p>
            <p className="text-xs text-muted-foreground">All houses in this area have been surveyed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accent/30 bg-card/90 backdrop-blur-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Navigation size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Next House</p>
            <p className="text-xs text-muted-foreground">{uncompletedCount} remaining</p>
          </div>
        </div>
      </div>

      {nearest && (
        <div className="rounded-lg bg-muted/30 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                House #{nearest.house.house_number}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {nearest.house.address}
              </p>
            </div>
            <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
              {formatDistance(nearest.distance)}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => onNavigate?.(nearest.house)}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            id="navigate-to-house"
          >
            <Navigation size={14} />
            Navigate
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Utility: generate an optimized route visiting all unsurveyed houses (greedy nearest-neighbor).
 */
export function generateRoute(
  startLat: number,
  startLng: number,
  houses: RoutableHouse[]
): RoutableHouse[] {
  const unsurveyed = houses.filter((h) => h.status === 'pending' || h.status === 'in_progress');
  if (unsurveyed.length === 0) return [];

  const route: RoutableHouse[] = [];
  const remaining = [...unsurveyed];
  let currentLat = startLat;
  let currentLng = startLng;

  while (remaining.length > 0) {
    let minDist = Infinity;
    let nearestIdx = 0;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(currentLat, currentLng, remaining[i].lat, remaining[i].lng);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    const next = remaining.splice(nearestIdx, 1)[0];
    route.push(next);
    currentLat = next.lat;
    currentLng = next.lng;
  }

  return route;
}
