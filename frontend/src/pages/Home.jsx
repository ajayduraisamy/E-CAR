/// Home.jsx - Main landing page with hero section, featured cars, and ordering flow
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import GradientButton from '../components/GradientButton';
import CarCard from '../components/CarCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { carService } from '../services/api';

// Data for "Why Choose Us" section
const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: 'Trusted Listings',
    description: 'Every listing goes through a clean and transparent data flow.'
  },
  {
    icon: Zap,
    title: 'Smart Comparison',
    description: 'Compare key performance specs instantly before you decide.'
  },
  {
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'High-end UI and smooth interactions crafted for speed and confidence.'
  }
];

// Home page component
import { AnimatePresence } from 'framer-motion';
import { X, Car as CarIcon } from 'lucide-react';
import { orderService, paymentService } from '../services/api';

// Main Home component
function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderingCar, setOrderingCar] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardLast4, setCardLast4] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  // Fetch featured cars on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await carService.getCars();
        setCars(data.slice(0, 6));
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load featured cars.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="space-y-16 pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-hero-grid p-8 shadow-2xl sm:p-12">
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-blue-200 bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-blue-500/30 dark:bg-slate-900/40 dark:text-blue-300"
          >
            Car Comparison & Marketplace
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 text-4xl font-bold leading-tight sm:text-5xl"
          >
            Discover, Compare and Sell Cars with a{' '}
            <span className="text-brand-gradient">Premium Digital Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-2xl text-base text-slate-700 dark:text-slate-300 sm:text-lg"
          >
            E-CAR helps you make faster and smarter car decisions with elegant comparison tools,
            trusted listings, and a seamless marketplace journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <GradientButton to="/marketplace">
              Explore Cars <ArrowRight size={16} />
            </GradientButton>
            <GradientButton to="/compare" variant="outline">
              Compare Models
            </GradientButton>
          </motion.div>
        </div>
      </section>
<section className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/60 sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Why Choose E-CAR</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index }}
              className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900/80"
            >
              <div className="mb-4 w-fit rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 p-2.5 text-white shadow-glow">
                <item.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Featured Cars</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Curated models from the latest additions.
          </p>
        </div>

        {loading && <LoadingSpinner label="Loading featured cars..." />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && cars.length === 0 && (
          <EmptyState title="No featured cars yet" description="Admin can add cars from dashboard." />
        )}
        {!loading && !error && cars.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <CarCard car={car} onOrder={() => setOrderingCar(car)} />
                    {/* Order Modal (global, not inside CarCard) */}
                    <AnimatePresence>
                      {orderingCar && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                          onClick={() => setOrderingCar(null)}
                        >
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <h2 className="text-2xl font-bold flex items-center gap-2"><CarIcon size={20}/> Order Car</h2>
                              <button onClick={() => setOrderingCar(null)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                            </div>
                            <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                              <p className="text-sm text-slate-600 dark:text-slate-400">Car</p>
                              <p className="text-lg font-semibold">{orderingCar.name}</p>
                              <p className="text-2xl font-bold text-blue-600">₹{orderingCar.price?.toLocaleString()}</p>
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
                                onClick={async () => {
                                  try {
                                    setOrderLoading(true);
                                    setOrderMessage('');
                                    const orderRes = await orderService.createOrder({ carId: orderingCar._id, amount: orderingCar.price });
                                    const orderId = orderRes.data.order._id;
                                    const paymentPayload = { orderId, amount: orderingCar.price, method: paymentMethod };
                                    if (paymentMethod === 'card') {
                                      if (!cardLast4 || cardLast4.length !== 4) {
                                        setOrderMessage('Please enter last 4 digits of card');
                                        setOrderLoading(false);
                                        return;
                                      }
                                      paymentPayload.card_last4 = cardLast4;
                                    } else {
                                      if (!upiId) {
                                        setOrderMessage('Please enter UPI ID');
                                        setOrderLoading(false);
                                        return;
                                      }
                                      paymentPayload.upi_id = upiId;
                                    }
                                    await paymentService.payOrder(paymentPayload);
                                    setOrderMessage('Order placed successfully!');
                                    setTimeout(() => {
                                      setOrderingCar(null);
                                      setOrderMessage('');
                                    }, 1500);
                                  } catch (err) {
                                    setOrderMessage(err?.response?.data?.message || 'Failed to place order.');
                                  } finally {
                                    setOrderLoading(false);
                                  }
                                }}
                                disabled={orderLoading}
                                className="w-full"
                              >
                                {orderLoading ? 'Placing Order...' : 'Place Order'}
                              </GradientButton>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      
    </div>
  );
}

export default Home;
