import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, ShoppingCart, X, CreditCard, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { carService, orderService, paymentService } from '../services/api';

const specMeta = [
  { key: 'price', label: 'Price', suffix: '' },
  { key: 'horsepower', label: 'Horsepower', suffix: 'HP' },
  { key: 'mileage', label: 'Mileage', suffix: 'km/l' },
  { key: 'top_speed', label: 'Top Speed', suffix: 'km/h' }
];

function Compare() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState('');
  const [selectedCar2, setSelectedCar2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState('');
  
  // Order modal state
  const [orderingCar, setOrderingCar] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardLast4, setCardLast4] = useState('');
  const [upiId, setUpiId] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoadingCars(true);
        setError('');
        const { data } = await carService.getCars();
        setCars(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load cars.');
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

  const isCompareDisabled = useMemo(
    () => !selectedCar1 || !selectedCar2 || selectedCar1 === selectedCar2 || loadingCompare,
    [selectedCar1, selectedCar2, loadingCompare]
  );

  const handleCompare = async () => {
    try {
      setLoadingCompare(true);
      setError('');
      const { data } = await carService.compareCars(selectedCar1, selectedCar2);
      setComparisonResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Comparison failed. Please try again.');
    } finally {
      setLoadingCompare(false);
    }
  };

  const handleOrderClick = (car) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/compare' } });
      return;
    }
    setOrderingCar(car);
    setPaymentMethod('card');
    setCardLast4('');
    setUpiId('');
    setOrderMessage('');
  };

  const handlePlaceOrder = async () => {
    try {
      setOrderLoading(true);
      setOrderMessage('');

      // Create order
      const orderRes = await orderService.createOrder({
        carId: orderingCar._id,
        amount: Number(orderingCar.price || 0)
      });

      const orderId = orderRes.data.order._id;

      // Process payment
      const paymentPayload = {
        orderId,
        amount: orderingCar.price,
        method: paymentMethod
      };

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
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Compare Cars</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Select any two cars and get a side-by-side performance breakdown.
        </p>

        {loadingCars ? (
          <LoadingSpinner label="Loading cars..." />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto] md:items-end">
            <label className="space-y-2">
              <span className="text-sm font-medium">Car 1</span>
              <select
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                value={selectedCar1}
                onChange={(event) => setSelectedCar1(event.target.value)}
              >
                <option value="">Select first car</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.brand} - {car.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-center">
              <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 p-3 text-white shadow-glow">
                <ArrowRightLeft size={18} />
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium">Car 2</span>
              <select
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                value={selectedCar2}
                onChange={(event) => setSelectedCar2(event.target.value)}
              >
                <option value="">Select second car</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.brand} - {car.name}
                  </option>
                ))}
              </select>
            </label>

            <GradientButton onClick={handleCompare} disabled={isCompareDisabled} className="h-11">
              {loadingCompare ? 'Comparing...' : 'Compare'}
            </GradientButton>
          </div>
        )}
      </section>

      {error && <ErrorState message={error} />}

      {!comparisonResult && !loadingCompare && !error && (
        <EmptyState
          title="Comparison data will appear here"
          description="Pick two cars and click Compare to view detailed results."
        />
      )}

      {comparisonResult && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden p-6"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3">Specification</th>
                  <th className="px-4 py-3">{comparisonResult.cars[0]?.name}</th>
                  <th className="px-4 py-3">{comparisonResult.cars[1]?.name}</th>
                  <th className="px-4 py-3">Winner</th>
                </tr>
              </thead>
              <tbody>
                {specMeta.map((spec) => {
                  const row = comparisonResult.comparison?.[spec.key];
                  const car1Name = comparisonResult.cars[0]?.name;
                  const car2Name = comparisonResult.cars[1]?.name;
                  const better = row?.better;

                  const cellClass = (carName) => {
                    if (better === 'tie') return 'text-slate-600 dark:text-slate-300';
                    return better === carName
                      ? 'font-semibold text-emerald-600 dark:text-emerald-300'
                      : 'text-rose-500 dark:text-rose-300';
                  };

                  return (
                    <tr key={spec.key} className="border-b border-slate-100 dark:border-slate-800/70">
                      <td className="px-4 py-3 font-medium">{spec.label}</td>
                      <td className={`px-4 py-3 ${cellClass(car1Name)}`}>
                        {row?.car1} {spec.suffix}
                      </td>
                      <td className={`px-4 py-3 ${cellClass(car2Name)}`}>
                        {row?.car2} {spec.suffix}
                      </td>
                      <td className="px-4 py-3">
                        {better === 'tie' ? (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs dark:bg-slate-700">
                            Tie
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            {better}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-200">
            <span className="font-semibold">Summary:</span> {comparisonResult.summary}
          </div>

       
          <div className="mt-6 flex flex-wrap gap-4">
            <GradientButton onClick={() => handleOrderClick(comparisonResult.cars[0])}>
              <ShoppingCart size={16} />
              Order {comparisonResult.cars[0]?.name}
            </GradientButton>
            <GradientButton
              variant="outline"
              onClick={() => handleOrderClick(comparisonResult.cars[1])}
            >
              <ShoppingCart size={16} />
              Order {comparisonResult.cars[1]?.name}
            </GradientButton>
          </div>
        </motion.section>
      )}

      {/* Order Modal */}
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
                <h2 className="text-2xl font-bold">Place Order</h2>
                <button
                  onClick={() => setOrderingCar(null)}
                  className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
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

export default Compare;

