'use client';

import { Bell, Search, User } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/auth-provider';

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 w-full h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search households, IDs..."
            className="w-full bg-secondary/50 border-none pl-9 rounded-full focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-border">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium leading-none mb-1 text-foreground">
              {user?.user_metadata?.full_name || user?.email || 'Officer'}
            </span>
            <span className="text-xs text-muted-foreground leading-none">
              Enumerator
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
