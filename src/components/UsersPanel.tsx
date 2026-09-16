'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  note: string | null;
  sublinkConfigs: Array<{ sublinkId: number; serverLimit: number }>;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Sublink {
  id: number;
  name: string;
  totalServers: number;
}

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [sublinks, setSublinks] = useState<Sublink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    note: '',
    sublinkConfigs: [] as Array<{ sublinkId: number; serverLimit: number }>,
    expiresAt: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchSublinks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSublinks = async () => {
    try {
      const response = await fetch('/api/sublinks');
      const data = await response.json();
      if (data.success) {
        setSublinks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sublinks:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUser.sublinkConfigs.length === 0) {
      alert('Kamida bitta sublink tanlang!');
      return;
    }
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          expiresAt: newUser.expiresAt || null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers([...users, data.data]);
        setNewUser({
          name: '',
          note: '',
          sublinkConfigs: [],
          expiresAt: '',
        });
        setShowAddForm(false);
      } else {
        alert('Xato: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Qo\'shishda xatolik yuz berdi');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Ushbu foydalanuvchini o\'chirmoqchimisiz?')) return;
    
    try {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map(u => u.id === id ? data.data : u));
      }
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  };

  const addSublinkConfig = () => {
    if (sublinks.length === 0) {
      alert('Avval sublink qo\'shing!');
      return;
    }
    setNewUser({
      ...newUser,
      sublinkConfigs: [
        ...newUser.sublinkConfigs,
        { sublinkId: sublinks[0].id, serverLimit: 10 },
      ],
    });
  };

  const removeSublinkConfig = (index: number) => {
    setNewUser({
      ...newUser,
      sublinkConfigs: newUser.sublinkConfigs.filter((_, i) => i !== index),
    });
  };

  const updateSublinkConfig = (index: number, field: 'sublinkId' | 'serverLimit', value: number) => {
    const configs = [...newUser.sublinkConfigs];
    configs[index][field] = value;
    setNewUser({ ...newUser, sublinkConfigs: configs });
  };

  const getSubscriptionUrl = (userId: number, format: 'base64' | 'raw' = 'base64') => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/api/users/${userId}/subscription?format=${format}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nusxalandi!');
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
        <h2 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Yangi Foydalanuvchi
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Yangi Foydalanuvchi Qo&apos;shish</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ismi</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
              <input
                type="text"
                value={newUser.note}
                onChange={(e) => setNewUser({ ...newUser, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Muddati (ixtiyoriy)</label>
              <input
                type="datetime-local"
                value={newUser.expiresAt}
                onChange={(e) => setNewUser({ ...newUser, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Sublinklar Konfiguratsiyasi</label>
                <button
                  type="button"
                  onClick={addSublinkConfig}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                >
                  + Qo&apos;shish
                </button>
              </div>
              <div className="space-y-2">
                {newUser.sublinkConfigs.map((config, index) => (
                  <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded">
                    <select
                      value={config.sublinkId}
                      onChange={(e) => updateSublinkConfig(index, 'sublinkId', parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {sublinks.map(sublink => (
                        <option key={sublink.id} value={sublink.id}>
                          {sublink.name} ({sublink.totalServers} servers)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={config.serverLimit}
                      onChange={(e) => updateSublinkConfig(index, 'serverLimit', parseInt(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Limit"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => removeSublinkConfig(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {newUser.sublinkConfigs.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Sublink qo&apos;shing
                  </p>
                )}
              </div>
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
        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Hozircha foydalanuvchilar yo&apos;q. Yangi foydalanuvchi qo&apos;shing.
          </div>
        ) : (
          users.map((user) => {
            const isExpired = user.expiresAt && new Date(user.expiresAt) < new Date();
            
            return (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive && !isExpired
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.isActive && !isExpired ? 'Aktiv' : isExpired ? 'Muddati tugagan' : 'Nofaol'}
                      </span>
                    </div>
                    {user.note && <p className="text-sm text-gray-600 mb-2">{user.note}</p>}
                    {user.expiresAt && (
                      <p className="text-sm text-gray-600">
                        Muddati: {new Date(user.expiresAt).toLocaleString('uz-UZ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title={user.isActive ? 'O\'chirish' : 'Yoqish'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Sublinklar:</h4>
                  <div className="space-y-1">
                    {user.sublinkConfigs.map((config, idx) => {
                      const sublink = sublinks.find(s => s.id === config.sublinkId);
                      return (
                        <div key={idx} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                          {sublink?.name || `Sublink #${config.sublinkId}`} - 
                          <span className="font-medium text-blue-600 ml-1">{config.serverLimit} ta server</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Subscription URL:</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getSubscriptionUrl(user.id)}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(getSubscriptionUrl(user.id))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Nusxalash
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(getSubscriptionUrl(user.id, 'raw'))}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition-colors"
                    >
                      Raw formatda nusxalash
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
