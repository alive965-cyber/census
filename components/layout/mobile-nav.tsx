'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Map as MapIcon, PlusCircle, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileLinks = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Map', href: '/map', icon: MapIcon },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileLinks.map((link, index) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          
          // Insert the prominent Add button in the middle
          if (index === 1) {
            return (
              <div key="group" className="flex items-center justify-around w-full">
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{link.name}</span>
                </Link>
                
                {/* Central Add Button */}
                <div className="relative -top-5">
                  <Link href="/add">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center border-4 border-background">
                      <PlusCircle size={28} />
                    </div>
                  </Link>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
