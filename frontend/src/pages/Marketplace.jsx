// This file is part of CarBazaar - A Peer-to-Peer Car Selling Platform
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, PlusCircle, ShoppingCart, X, CreditCard, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { marketService, orderService, paymentService } from '../services/api';

// Base URL for images (adjust if your backend serves from a different path)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Marketplace page where users can browse listings and place orders.
function Marketplace() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Order modal state
  const [orderingItem, setOrderingItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardLast4, setCardLast4] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  // Fetch marketplace listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await marketService.getListings();
        setListings(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load marketplace listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Handle order button click - show order modal if authenticated, otherwise redirect to login
  const handleOrderClick = (item) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/marketplace' } });
      return;
    }
    setOrderingItem(item);
    setPaymentMethod('card');
    setCardLast4('');
    setUpiId('');
    setOrderMessage('');
  };

  // Handle placing an order with selected payment method
  const handlePlaceOrder = async () => {
    try {
      setOrderLoading(true);
      setOrderMessage('');

      // Create order
    const orderRes = await orderService.createOrder({
      listingId: orderingItem._id,
      amount: Number(orderingItem.price)
    });
      const orderId = orderRes.data.order._id;

      // Process payment
      const paymentPayload = {
        orderId,
        amount: orderingItem.price,
        method: paymentMethod
      };

      // Validate payment details based on selected method
      if (paymentMethod === 'card') {
        if (!cardLast4 || cardLast4.length !== 4) {
          setOrderMessage('Please enter last 4 digits of card');
          setOrderLoading(false);
          return;
        }
        paymentPayload.card_last4 = cardLast4;
      } else {
        // UPI validation (basic check, can be enhanced)
        if (!upiId) {
          setOrderMessage('Please enter UPI ID');
          setOrderLoading(false);
          return;
        }
        paymentPayload.upi_id = upiId;
      }
// Call payment API
      await paymentService.payOrder(paymentPayload);

      setOrderMessage('Order placed successfully!');
      setTimeout(() => {
        setOrderingItem(null);
        navigate('/orders');
      }, 1500);
    } catch (err) {
      setOrderMessage(err?.response?.data?.message || 'Failed to place order.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <section className="glass-panel flex flex-wrap items-center justify-between gap-4 p-8">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Marketplace</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Discover verified listings and connect directly with sellers.
          </p>
        </div>
        <div>
          {isAuthenticated ? (
            <GradientButton to="/sell">
              <PlusCircle size={16} />
              Sell Your Car
            </GradientButton>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            >
              Login to Sell
            </Link>
          )}
        </div>
      </section>

      {loading && <LoadingSpinner label="Loading listings..." />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && listings.length === 0 && (
        <EmptyState
          title="No listings found"
          description="Be the first one to post your car in the marketplace."
        />
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item, index) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-xl dark:border-slate-800 dark:bg-slate-900/75"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    item.image
                      ? `${API_BASE}/${item.image}`
                      : 'https://images.unsplash.com/photo-1617470702892-e01504297e15?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm font-bold text-blue-200">INR {item.price}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 text-sm">
                <p className="line-clamp-2 text-slate-600 dark:text-slate-300">{item.description}</p>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-violet-500" />
                    {item.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone size={14} className="text-blue-500" />
                    {item.contact}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Seller: {item.user?.name || 'User'}
                </p>
                <GradientButton
                  onClick={() => handleOrderClick(item)}
                  className="w-full mt-2"
                >
                  <ShoppingCart size={16} />
                  Order Now
                </GradientButton>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Order Modal */}
      <AnimatePresence>
        {orderingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setOrderingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Place Order</h2>
                <button
                  onClick={() => setOrderingItem(null)}
                  className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Item</p>
                <p className="text-lg font-semibold">{orderingItem.title}</p>
                <p className="text-2xl font-bold text-blue-600">₹{orderingItem.price?.toLocaleString()}</p>
              </div>

              {orderMessage && (
                <p className={`mb-4 rounded-2xl px-4 py-2 text-sm ${
                  orderMessage.includes('success')
                    ? 'border border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border border-red-300/70 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300'
                }`}>
                  {orderMessage}
                </p>
              )}

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Payment Method</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 transition ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                      }`}
                    >
                      <CreditCard size={18} />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 transition ${
                        paymentMethod === 'upi'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                      }`}
                    >
                      <Wallet size={18} />
                      UPI
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' ? (
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium">Card Last 4 Digits</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                    />
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium">UPI ID</span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="user@upi"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                    />
                  </label>
                )}

                <GradientButton
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full"
                >
                  {orderLoading ? 'Processing...' : 'Pay & Place Order'}
                </GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Marketplace;
