// AdminUsers.jsx - Admin dashboard page for managing and viewing all registered users.
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, Mail, Shield, Search, Trash2, X, UserRound, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { userService } from '../services/api';

// Note: Ensure your backend has the route GET /api/users that returns all registered users for admin view.
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Delete confirmation state
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all users for admin view
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
// Calculate stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length
  };

  // Handle delete user click
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  // Handle confirm delete action
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      // Note: You'll need to add deleteUser to userService if you want delete functionality
      // For now, we'll just remove from local state
      setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
      setDeletingUser(null);
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date utility
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Manage Users</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          View and manage all registered users in the system.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Total Users</p>
            <Users className="text-blue-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold">{stats.total}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Admins</p>
            <Shield className="text-violet-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-violet-600">{stats.admins}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Regular Users</p>
            <UserRound className="text-emerald-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-emerald-600">{stats.users}</h2>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="glass-panel p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none w-64"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <Shield size={18} className="text-slate-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-sm outline-none dark:text-slate-100"
            >
              <option value="all" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">All Roles</option>
              <option value="admin" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Admin</option>
              <option value="user" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">User</option>
            </select>
          </div>
        </div>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading users..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      user.role === 'admin' 
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}>
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        }`}
                      >
                        {user.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    title="Delete user"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail size={16} className="text-slate-400" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                    <Calendar size={16} />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No users found</h3>
          <p className="text-slate-500">
            {searchTerm || roleFilter !== 'all' ? 'Try adjusting your filters' : 'No users registered yet'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setDeletingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/60">
                  <Trash2 className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete User</h2>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to delete <strong>{deletingUser.name}</strong>? 
                This action cannot be undone.
              </p>

              {deletingUser.role === 'admin' && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ This user has admin privileges.
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminUsers;