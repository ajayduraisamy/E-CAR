// AdminOrders.jsx - Admin dashboard page for managing and viewing all customer orders.
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Car, Calendar, CheckCircle, Clock, Search, Filter, DollarSign, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderService } from '../services/api';

// Note: Ensure your backend has the route GET /api/order that returns all orders for admin users.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// AdminOrders component definition
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all'); 

  // Fetch all orders for admin view
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Filtering by User Role (assuming order.user.role exists)
    const matchesRole = roleFilter === 'all' || order.user?.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  };

  // Format date utility
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Manage Orders</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          View and manage all customer orders in the system.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2 text-slate-500">
            <span className="text-sm font-medium">Total Orders</span>
            <ShoppingCart size={20} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold">{stats.total}</h2>
        </div>
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2 text-slate-500">
            <span className="text-sm font-medium">Pending</span>
            <Clock size={20} className="text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-amber-600">{stats.pending}</h2>
        </div>
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2 text-slate-500">
            <span className="text-sm font-medium">Paid</span>
            <CheckCircle size={20} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-emerald-600">{stats.paid}</h2>
        </div>
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2 text-slate-500">
            <span className="text-sm font-medium">Total Revenue</span>
            <DollarSign size={20} className="text-violet-500" />
          </div>
          <h2 className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
      </section>

      {/* Filters Area */}
      <section className="glass-panel p-4 flex flex-wrap gap-4">
        <div className="flex flex-1 min-w-[280px] items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
          <Filter size={18} className="text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm outline-none dark:bg-slate-800"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

       
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Visual Preview */}
                    <div className="relative h-48 lg:h-auto lg:w-64 flex-shrink-0">
                      <img
                        src={
                          order.car?.image ? `${API_BASE}/${order.car.image}` : 
                          order.listing?.image ? `${API_BASE}/${order.listing.image}` : 
                          'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt="Order Item"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-[10px] uppercase tracking-widest opacity-80">{order.car?.brand || 'Premium'}</p>
                        <h3 className="text-lg font-bold">{order.car?.name || order.listing?.title || 'Car Order'}</h3>
                      </div>
                    </div>

                    {/* Information */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex flex-wrap justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                              <User size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{order.user?.name || 'Guest User'}</p>
                              <p className="text-xs text-slate-500">{order.user?.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar size={16} />
                            <span>Ordered on {formatDate(order.createdAt)}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-500 font-medium">Order Amount</p>
                          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{order.amount?.toLocaleString()}</p>
                          
                          <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            order.status === 'paid' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                          }`}>
                            {order.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {order.status?.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {order.payment_method && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                           <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Payment via:</span>
                           <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded capitalize">{order.payment_method}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 glass-panel">
                <ShoppingCart size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Orders Found</h3>
                <p className="text-slate-500">Adjust your filters or search terms to find what you're looking for.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;