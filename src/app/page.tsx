'use client';

import { useState, useEffect } from 'react';
import SublinksPanel from '@/components/SublinksPanel';
import UsersPanel from '@/components/UsersPanel';
import StatisticsPanel from '@/components/StatisticsPanel';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'sublinks' | 'users' | 'statistics'>('sublinks');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SubConverter</h1>
                <p className="text-sm text-gray-600">Subscription Link Manager</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yangilash
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('sublinks')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'sublinks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📡 Sublinklar
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Foydalanuvchilar
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'statistics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Statistika
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'sublinks' && <SublinksPanel key={refreshKey} />}
        {activeTab === 'users' && <UsersPanel key={refreshKey} />}
        {activeTab === 'statistics' && <StatisticsPanel key={refreshKey} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>SubConverter Dashboard &copy; 2026 • Docker Ready</p>
        </div>
      </footer>
    </div>
  );
}
