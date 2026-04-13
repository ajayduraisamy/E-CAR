import { motion } from 'framer-motion';
import { ShoppingCart, Calendar, CheckCircle, Clock, Car } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderService } from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await orderService.getUserOrders();
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
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">My Orders</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          View your order history and payment status.
        </p>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
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
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <ShoppingCart size={18} className="text-blue-500" />
                        <span className="font-medium">Order #{order._id?.slice(-6).toUpperCase()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Car size={18} className="text-violet-500" />
                        <span>Price: ₹{order.car?.price?.toLocaleString() || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                        <Calendar size={16} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

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

      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No orders yet</h3>
          <p className="text-slate-500">Your orders will appear here after you make a purchase</p>
        </div>
      )}
    </div>
  );
}

export default Orders;