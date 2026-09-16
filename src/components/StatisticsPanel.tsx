'use client';

import { useState, useEffect } from 'react';

interface OverviewStats {
  sublinks: {
    total: number;
    active: number;
  };
  servers: {
    total: number;
    byType: {
      vless: number;
      vmess: number;
      shadowsocks: number;
      trojan: number;
      hysteria2: number;
      other: number;
    };
  };
  access: {
    last24h: number;
  };
}

interface SublinkStat {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  totalServers: number;
  serverTypes: {
    vless: number;
    vmess: number;
    shadowsocks: number;
    trojan: number;
    hysteria2: number;
    other: number;
  };
  lastFetchedAt: string | null;
  lastFetchStatus: string | null;
  statistics: {
    totalFetches: number;
    successFetches: number;
    errorFetches: number;
  };
}

export default function StatisticsPanel() {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [sublinkStats, setSublinkStats] = useState<SublinkStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'sublinks'>('overview');

  useEffect(() => {
    fetchOverviewStats();
    fetchSublinkStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      const response = await fetch('/api/statistics?type=overview');
      const data = await response.json();
      if (data.success) {
        setOverviewStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch overview stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSublinkStats = async () => {
    try {
      const response = await fetch('/api/statistics?type=sublinks');
      const data = await response.json();
      if (data.success) {
        setSublinkStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sublink stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Umumiy Ko&apos;rinish
        </button>
        <button
          onClick={() => setActiveView('sublinks')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'sublinks'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Sublinklar Statistikasi
        </button>
      </div>

      {activeView === 'overview' && overviewStats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{overviewStats.sublinks.total}</div>
                  <div className="text-sm text-gray-600">Jami Sublinklar</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{overviewStats.sublinks.active}</span> ta aktiv
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{overviewStats.servers.total}</div>
                  <div className="text-sm text-gray-600">Jami Serverlar</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{overviewStats.access.last24h}</div>
                  <div className="text-sm text-gray-600">So&apos;nggi 24 soat</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">Access loglar</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Turlari</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{overviewStats.servers.byType.vless}</div>
                <div className="text-sm text-gray-600 mt-1">VLESS</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{overviewStats.servers.byType.vmess}</div>
                <div className="text-sm text-gray-600 mt-1">VMess</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{overviewStats.servers.byType.shadowsocks}</div>
                <div className="text-sm text-gray-600 mt-1">Shadowsocks</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{overviewStats.servers.byType.trojan}</div>
                <div className="text-sm text-gray-600 mt-1">Trojan</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{overviewStats.servers.byType.hysteria2}</div>
                <div className="text-sm text-gray-600 mt-1">Hysteria2</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{overviewStats.servers.byType.other}</div>
                <div className="text-sm text-gray-600 mt-1">Boshqalar</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'sublinks' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sublinklar Statistikasi</h3>
          {sublinkStats.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              Statistika ma&apos;lumotlari yo&apos;q
            </div>
          ) : (
            sublinkStats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{stat.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        stat.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {stat.isActive ? 'Aktiv' : 'Nofaol'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 break-all">{stat.url}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">{stat.statistics.totalFetches}</div>
                    <div className="text-xs text-gray-600">Jami so&apos;rovlar</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{stat.statistics.successFetches}</div>
                    <div className="text-xs text-gray-600">Muvaffaqiyatli</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">{stat.statistics.errorFetches}</div>
                    <div className="text-xs text-gray-600">Xatolar</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{stat.totalServers}</div>
                    <div className="text-xs text-gray-600">Serverlar</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {stat.serverTypes.vless > 0 && (
                    <div className="bg-purple-50 rounded p-2 text-center">
                      <div className="font-bold text-purple-600">{stat.serverTypes.vless}</div>
                      <div className="text-xs text-gray-600">VLESS</div>
                    </div>
                  )}
                  {stat.serverTypes.vmess > 0 && (
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <div className="font-bold text-blue-600">{stat.serverTypes.vmess}</div>
                      <div className="text-xs text-gray-600">VMess</div>
                    </div>
                  )}
                  {stat.serverTypes.shadowsocks > 0 && (
                    <div className="bg-green-50 rounded p-2 text-center">
                      <div className="font-bold text-green-600">{stat.serverTypes.shadowsocks}</div>
                      <div className="text-xs text-gray-600">SS</div>
                    </div>
                  )}
                  {stat.serverTypes.trojan > 0 && (
                    <div className="bg-red-50 rounded p-2 text-center">
                      <div className="font-bold text-red-600">{stat.serverTypes.trojan}</div>
                      <div className="text-xs text-gray-600">Trojan</div>
                    </div>
                  )}
                  {stat.serverTypes.hysteria2 > 0 && (
                    <div className="bg-indigo-50 rounded p-2 text-center">
                      <div className="font-bold text-indigo-600">{stat.serverTypes.hysteria2}</div>
                      <div className="text-xs text-gray-600">HY2</div>
                    </div>
                  )}
                  {stat.serverTypes.other > 0 && (
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="font-bold text-gray-600">{stat.serverTypes.other}</div>
                      <div className="text-xs text-gray-600">Other</div>
                    </div>
                  )}
                </div>

                {stat.lastFetchedAt && (
                  <div className="mt-4 text-sm text-gray-600">
                    So&apos;nggi yangilanish: {new Date(stat.lastFetchedAt).toLocaleString('uz-UZ')}
                    {stat.lastFetchStatus === 'error' && (
                      <span className="ml-2 text-red-600">• Xato</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
