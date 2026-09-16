'use client';

import { useState, useEffect } from 'react';

interface Sublink {
  id: number;
  name: string;
  url: string;
  format: string;
  isActive: boolean;
  totalServers: number;
  vlessCount: number;
  vmessCount: number;
  shadowsocksCount: number;
  trojanCount: number;
  hysteria2Count: number;
  otherCount: number;
  lastFetchedAt: string | null;
  lastFetchStatus: string | null;
  lastFetchError: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SublinksPanel() {
  const [sublinks, setSublinks] = useState<Sublink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSublink, setNewSublink] = useState({ name: '', url: '' });
  const [refreshingId, setRefreshingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSublinks();
  }, []);

  const fetchSublinks = async () => {
    try {
      const response = await fetch('/api/sublinks');
      const data = await response.json();
      if (data.success) {
        setSublinks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sublinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSublink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sublinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSublink),
      });
      const data = await response.json();
      if (data.success) {
        setSublinks([...sublinks, data.data]);
        setNewSublink({ name: '', url: '' });
        setShowAddForm(false);
      } else {
        alert('Xato: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to add sublink:', error);
      alert('Qo\'shishda xatolik yuz berdi');
    }
  };

  const handleRefreshSublink = async (id: number) => {
    setRefreshingId(id);
    try {
      const response = await fetch(`/api/sublinks/${id}/refresh`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setSublinks(sublinks.map(s => s.id === id ? data.data : s));
      }
    } catch (error) {
      console.error('Failed to refresh sublink:', error);
    } finally {
      setRefreshingId(null);
    }
  };

  const handleDeleteSublink = async (id: number) => {
    if (!confirm('Ushbu sublinkni o\'chirmoqchimisiz?')) return;
    
    try {
      await fetch(`/api/sublinks?id=${id}`, { method: 'DELETE' });
      setSublinks(sublinks.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete sublink:', error);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/sublinks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await response.json();
      if (data.success) {
        setSublinks(sublinks.map(s => s.id === id ? data.data : s));
      }
    } catch (error) {
      console.error('Failed to toggle active:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Linklar</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Yangi Sublink
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Yangi Sublink Qo&apos;shish</h3>
          <form onSubmit={handleAddSublink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomi</label>
              <input
                type="text"
                value={newSublink.name}
                onChange={(e) => setNewSublink({ ...newSublink, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={newSublink.url}
                onChange={(e) => setNewSublink({ ...newSublink, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/subscription"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Qo&apos;shish
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {sublinks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Hozircha sublinklar yo&apos;q. Yangi sublink qo&apos;shing.
          </div>
        ) : (
          sublinks.map((sublink) => (
            <div key={sublink.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{sublink.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sublink.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sublink.isActive ? 'Aktiv' : 'Nofaol'}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {sublink.format === 'base64' ? 'Base64' : 'Raw'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 break-all">{sublink.url}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRefreshSublink(sublink.id)}
                    disabled={refreshingId === sublink.id}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Yangilash"
                  >
                    <svg className={`w-5 h-5 ${refreshingId === sublink.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggleActive(sublink.id, sublink.isActive)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title={sublink.isActive ? 'O\'chirish' : 'Yoqish'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSublink(sublink.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="O'chirish"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">{sublink.totalServers}</div>
                  <div className="text-xs text-gray-600">Jami Serverlar</div>
                </div>
                {sublink.vlessCount > 0 && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{sublink.vlessCount}</div>
                    <div className="text-xs text-gray-600">VLESS</div>
                  </div>
                )}
                {sublink.vmessCount > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">{sublink.vmessCount}</div>
                    <div className="text-xs text-gray-600">VMess</div>
                  </div>
                )}
                {sublink.shadowsocksCount > 0 && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{sublink.shadowsocksCount}</div>
                    <div className="text-xs text-gray-600">Shadowsocks</div>
                  </div>
                )}
                {sublink.trojanCount > 0 && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">{sublink.trojanCount}</div>
                    <div className="text-xs text-gray-600">Trojan</div>
                  </div>
                )}
                {sublink.hysteria2Count > 0 && (
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-600">{sublink.hysteria2Count}</div>
                    <div className="text-xs text-gray-600">Hysteria2</div>
                  </div>
                )}
              </div>

              {sublink.lastFetchedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>So&apos;nggi yangilanish:</span>
                  <span className="font-medium">{new Date(sublink.lastFetchedAt).toLocaleString('uz-UZ')}</span>
                  {sublink.lastFetchStatus === 'error' && sublink.lastFetchError && (
                    <span className="text-red-600">• Xato: {sublink.lastFetchError}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
