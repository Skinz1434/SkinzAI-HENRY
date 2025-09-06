'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Brain,
  Briefcase,
  Award,
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface CODDATopNavigationProps {
  currentCase?: any;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function CODDATopNavigation({ 
  currentCase, 
  onMenuToggle, 
  isMenuOpen = false 
}: CODDATopNavigationProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const navigationItems = [
    { 
      id: 'home', 
      label: 'Platform Home', 
      href: '/', 
      icon: Home,
      description: 'Return to HENRY platform'
    },
    { 
      id: 'dashboard', 
      label: 'HENRY Dashboard', 
      href: '/henry/dashboard-full', 
      icon: Activity,
      description: 'Veterans dashboard'
    },
    { 
      id: 'hvec', 
      label: 'HVEC Clinical', 
      href: '/hvec', 
      icon: Brain,
      description: 'Clinical intelligence system'
    },
    { 
      id: 'va-claims', 
      label: 'VA Claims AI', 
      href: '/va-claims-ai', 
      icon: FileText,
      description: 'Claims analysis AI'
    },
    { 
      id: 'tera-analytics', 
      label: 'TERA Analytics', 
      href: '/tera-analytics', 
      icon: AlertTriangle,
      description: 'Toxic exposure analysis'
    }
  ];

  const notifications = [
    { id: 1, text: 'Case COD-2024-001 ready for review', time: '5m ago', type: 'info' },
    { id: 2, text: 'New IPR requirement detected', time: '1h ago', type: 'warning' },
    { id: 3, text: 'Quality check completed', time: '2h ago', type: 'success' }
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700 shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">CODDA</h1>
                <p className="text-xs text-gray-400">COD Assistant</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-slate-600" />

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
                  title={item.description}
                >
                  <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Center Section - Current Case Info */}
          {currentCase && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-700/30 rounded-lg">
              <FileText className="w-4 h-4 text-teal-400" />
              <div className="text-sm">
                <span className="text-gray-400">Current Case:</span>
                <span className="ml-2 font-medium">{currentCase.id}</span>
                <span className="ml-3 text-gray-400">|</span>
                <span className="ml-3 text-gray-400">Claimant:</span>
                <span className="ml-2 font-medium">{currentCase.claimant}</span>
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                  <div className="p-3 border-b border-slate-700">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className="px-3 py-2 hover:bg-slate-700/30 border-b border-slate-700/50">
                        <p className="text-sm">{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-700">
                    <button className="w-full text-sm text-teal-400 hover:text-teal-300 py-1">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm hidden sm:inline">User</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700/30">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700/30">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <div className="border-t border-slate-700 mt-1 pt-1">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700/30 w-full text-left">
                      <LogOut className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-700">
            <div className="flex flex-col gap-2">
              {navigationItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tour Overlay */}
      {false && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 pointer-events-none z-40">
          <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm pointer-events-auto">
            <h3 className="font-semibold text-gray-800 mb-2">Navigation Bar</h3>
            <p className="text-sm text-gray-600">
              Use the navigation bar to quickly access different sections of the application. 
              You can return to the dashboard, view cases, or access AI tools.
            </p>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Skip</button>
              <button className="px-3 py-1 bg-teal-600 text-white rounded text-sm">Next</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}