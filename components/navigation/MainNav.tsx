'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Users, 
  FileText, 
  RefreshCw,
  FileDown,
  Brain,
  Home,
  AlertTriangle
} from 'lucide-react';

export default function MainNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/hvec', label: 'HVEC Clinical Intelligence', icon: Brain },
    { href: '/henry/dashboard-full', label: 'HENRY Dashboard', icon: Activity },
    { href: '/va-claims-ai', label: 'VA Claims AI', icon: FileText },
    { href: '/codda', label: 'CODDA IDE', icon: RefreshCw },
    { href: '/tera-analytics', label: 'TERA Analytics', icon: AlertTriangle },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">HENRY Platform</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-gray-900 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile Navigation - Show only essential links */}
          <div className="flex lg:hidden space-x-2">
            {navItems.slice(1, 5).map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}