import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, PlusCircle, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { marketService } from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [deletingListing, setDeletingListing] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await marketService.getUserListings();
      setListings(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteClick = (listing) => {
    setDeletingListing(listing);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      // Remove from local state (backend delete endpoint needs to be added)
      setListings((prev) => prev.filter((l) => l._id !== deletingListing._id));
      setDeletingListing(null);
    } catch (err) {
      setError('Failed to delete listing.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-8">
      <section className="glass-panel flex flex-wrap items-center justify-between gap-4 p-8">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">My Listings</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage your car listings in the marketplace.
          </p>
        </div>
        <GradientButton to="/sell">
          <PlusCircle size={16} />
          Add New Listing
        </GradientButton>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading listings..." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item, index) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    item.image
                      ? `${API_BASE}/${item.image}`
                      : 'https://images.unsplash.com/photo-1617470702892-e01504297e15?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm font-bold text-blue-200">₹{item.price}</p>
                </div>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="absolute right-4 top-4 rounded-full bg-red-500/80 p-2 text-white backdrop-blur-sm transition hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
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
                  Posted on {formatDate(item.createdAt)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <EmptyState
          title="No listings yet"
          description="You haven't posted any cars for sale. Create your first listing!"
          action={
            <Link to="/sell">
              <GradientButton>
                <PlusCircle size={16} />
                Sell Your Car
              </GradientButton>
            </Link>
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setDeletingListing(null)}
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
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Listing</h2>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to delete <strong>{deletingListing.title}</strong>? 
                This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeletingListing(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyListings;