import { motion } from 'framer-motion';
import { MapPin, Phone, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { marketService } from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function Marketplace() {
  const { isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;
