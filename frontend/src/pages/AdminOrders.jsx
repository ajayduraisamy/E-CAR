import { motion } from 'framer-motion';
import { ShoppingCart, User, Car, Calendar, DollarSign, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderService } from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  };

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

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Total Orders</p>
            <ShoppingCart className="text-blue-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold">{stats.total}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Pending</p>
            <Clock className="text-amber-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-amber-600">{stats.pending}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Paid</p>
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-emerald-600">{stats.paid}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <DollarSign className="text-violet-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="glass-panel p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search by user or car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none w-64"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <Filter size={18} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Car Image */}
                <div className="relative h-48 lg:h-auto lg:w-64 flex-shrink-0">
                  <img
                    src={
                      order.car?.image
                        ? `${API_BASE}/${order.car.image}`
                        : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={order.car?.name || 'Car'}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:bg-gradient-to-t lg:from-black/70 lg:to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-white/80">{order.car?.brand}</p>
                    <h3 className="text-lg font-semibold">{order.car?.name || 'N/A'}</h3>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <User size={18} className="text-blue-500" />
                        <span className="font-medium">{order.user?.name || 'Unknown'}</span>
                        <span className="text-slate-500">({order.user?.email || 'N/A'})</span>
                      </div>

                      {/* Car Info */}
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Car size={18} className="text-violet-500" />
                        <span>Price: ₹{order.car?.price?.toLocaleString() || 'N/A'}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                        <Calendar size={16} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ₹{order.amount?.toLocaleString()}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium mt-2 ${
                          order.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                        }`}
                      >
                        {order.status === 'paid' ? (
                          <>
                            <CheckCircle size={12} />
                            Paid
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {order.payment_method && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Payment Method: <span className="font-medium capitalize">{order.payment_method}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No orders found</h3>
          <p className="text-slate-500">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers make purchases'}
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;