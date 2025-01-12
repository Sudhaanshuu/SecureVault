import React, { useState, useEffect } from 'react';
import { Plus, Key, LogOut, Globe, User as UserIcon, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Password {
  id: string;
  website: string;
  username: string;
  password: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassword, setNewPassword] = useState({ website: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadPasswords();
    }
  }, [user]);

  const loadPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPasswords(data || []);
    } catch (error) {
      console.error('Error loading passwords:', error);
    }
  };

  const handleAddPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('passwords').insert({
        user_id: user?.id,
        ...newPassword
      });

      if (error) throw error;

      setNewPassword({ website: '', username: '', password: '' });
      setShowAddForm(false);
      loadPasswords();
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">SecureVault</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-300">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Password Vault</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Password
            </button>
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">Add New Password</h2>
                <form onSubmit={handleAddPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-purple-500" />
                      </div>
                      <input
                        type="text"
                        value={newPassword.website}
                        onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2 border border-purple-500/30 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-300">Username/Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-purple-500" />
                      </div>
                      <input
                        type="text"
                        value={newPassword.username}
                        onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2 border border-purple-500/30 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-300">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-purple-500" />
                      </div>
                      <input
                        type="password"
                        value={newPassword.password}
                        onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2 border border-purple-500/30 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-purple-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {passwords.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-800 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-medium text-white">{entry.website}</h3>
                  </div>
                  <button
                    onClick={() => handleDeletePassword(entry.id)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-purple-300">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>{entry.username}</span>
                  </div>
                  <div className="flex items-center justify-between text-purple-300">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      <span>
                        {showPassword[entry.id] ? entry.password : '••••••••'}
                      </span>
                    </div>
                    <button
                      onClick={() => togglePasswordVisibility(entry.id)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      {showPassword[entry.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}