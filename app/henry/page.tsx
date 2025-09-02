'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function HenryPage() {
  useEffect(() => {
    // Redirect to the full dashboard
    redirect('/henry/dashboard-full');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">HENRY Platform</h1>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}