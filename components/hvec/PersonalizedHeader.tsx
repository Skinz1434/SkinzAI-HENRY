'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Settings, LogOut, Shield, Clock, 
  Activity, Award, Menu, X, Sun, Moon, Home,
  FileText, Users, BarChart3, Brain, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PersonalizedHeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  notifications?: number;
}

export default function PersonalizedHeader({
  userName = "VA Administrator",
  userRole = "Senior Analyst",
  userAvatar,
  notifications = 3
}: PersonalizedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const navigationItems = [
    { href: '/hvec', icon: Home, label: 'Dashboard' },
    { href: '/hvec/veterans', icon: Users, label: 'Veterans' },
    { href: '/hvec/claims', icon: FileText, label: 'Claims' },
    { href: '/hvec/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/hvec/ai-tools', icon: Brain, label: 'AI Tools' },
  ];

  return (
    <header className="relative z-40 border-b border-white/10 bg-gradient-to-r from-slate-900/95 via-slate-900/98 to-black/95 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/hvec" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-white">HENRY</h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Center - Personalized Greeting */}
          <div className="hidden md:flex flex-col items-center">
            <p className="text-xs text-slate-400">{greeting()},</p>
            <p className="font-display text-sm font-semibold text-white">{userName}</p>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-slate-300">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>

            {/* Platform Status */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
            </div>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-slate-400 transition-all hover:bg-white/5 hover:text-white">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notifications}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 transition-all hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="h-full w-full rounded-full" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-white">{userName}</p>
                  <p className="text-[10px] text-slate-400">{userRole}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
                  >
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-slate-400">{userRole}</p>
                    </div>
                    <div className="p-2">
                      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white">
                        <User className="h-4 w-4" />
                        Profile Settings
                      </button>
                      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white">
                        <Settings className="h-4 w-4" />
                        Preferences
                      </button>
                      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white">
                        <Award className="h-4 w-4" />
                        Achievements
                      </button>
                      <hr className="my-2 border-white/10" />
                      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/10 py-4"
            >
              <div className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}