'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Households', href: '/households', icon: Users },
  { name: 'Map View', href: '/map', icon: MapIcon },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-card border-r border-border transition-all duration-300 z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md min-w-[32px] flex items-center justify-center">
            <span className="font-bold">JC</span>
          </div>
          {!collapsed && <span className="font-bold text-lg whitespace-nowrap text-foreground">Janganana</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={collapsed ? link.name : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed ? "justify-center px-0" : "justify-start px-3 py-2.5"
          )}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
