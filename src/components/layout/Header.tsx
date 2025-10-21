'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex px-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              SWAPI Explorer
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
