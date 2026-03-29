'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, LayoutDashboard, TrendingUp, Settings, LogOut, Crown } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/session', icon: Mic, label: 'Practice' },
  { href: '/dashboard/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    plan?: string;
  };
}

export function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-surface-100 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg text-surface-900">FluentAI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner (free users) */}
      {(!user.plan || user.plan === 'FREE') && (
        <div className="mx-3 mb-3 p-3 bg-primary-50 border border-primary-100 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Crown className="w-3.5 h-3.5 text-primary-700" />
            <span className="text-xs font-semibold text-primary-800">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-primary-600 mb-2">Unlock unlimited sessions & Stuck Word Assistant</p>
          <Link href="/dashboard/settings?tab=billing" className="block text-center text-xs bg-primary-700 text-white py-1.5 rounded-lg font-medium hover:bg-primary-800 transition-colors">
            Upgrade Now
          </Link>
        </div>
      )}

      {/* User */}
      <div className="px-3 py-4 border-t border-surface-100">
        <div className="flex items-center gap-3 mb-3">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ''} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">{user.name}</p>
            <p className="text-xs text-surface-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="btn-ghost w-full text-sm text-surface-500 hover:text-correction"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
