'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SyncManager } from './sync-manager';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

interface OfflineContextType {
  isOnline: boolean;
  syncData: () => Promise<void>;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast?.('Back online. Syncing data...', { icon: <Wifi className="w-4 h-4 text-green-500" /> });
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast?.('You are offline. Data will be saved locally.', { icon: <WifiOff className="w-4 h-4 text-red-500" /> });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      await SyncManager.syncLocalToRemote();
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider value={{ isOnline, syncData, isSyncing }}>
      {children}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur flex items-center gap-2 text-sm z-50">
          <WifiOff className="w-4 h-4" />
          Offline Mode
        </div>
      )}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
