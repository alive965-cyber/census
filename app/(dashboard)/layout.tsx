import { AuthGuard } from '@/features/auth/auth-guard';
import { AuthProvider } from '@/features/auth/auth-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { OfflineProvider } from '@/features/offline/offline-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
        <OfflineProvider>
          <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-background">
              <Sidebar />
              <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 relative">
                  <div className="max-w-7xl mx-auto w-full h-full">
                    {children}
                  </div>
                </main>
              </div>
              <MobileNav />
            </div>
          </AuthGuard>
        </OfflineProvider>
      </AuthProvider>
  );
}
