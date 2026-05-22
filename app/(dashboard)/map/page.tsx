'use client';

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('@/components/map/census-map'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-4rem)] md:h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-lg text-slate-500">Loading Map...</div>
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <div className="w-full h-full -mx-4 md:-mx-6 -mt-6">
      <DynamicMap />
    </div>
  );
}
