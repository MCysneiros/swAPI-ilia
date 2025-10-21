'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Rocket, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Rocket,
  },
  {
    name: 'Planets',
    href: '/planets',
    icon: Globe,
  },
];

export function Header() {
  const pathname = usePathname();

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

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                  isActive ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
