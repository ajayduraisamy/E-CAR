import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, PlusCircle, Trash2, X, Edit2 } from 'lucide-react';
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
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', description: '', contact: '', location: '', image: null });
  const [editLoading, setEditLoading] = useState(false);

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setEditForm({
      title: listing.title,
      price: listing.price,
      description: listing.description,
      contact: listing.contact,
      location: listing.location,
      image: null
    });
  };

  const handleEditInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingListing) return;
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('price', editForm.price);
      formData.append('description', editForm.description);
      formData.append('contact', editForm.contact);
      formData.append('location', editForm.location);
      if (editForm.image) formData.append('image', editForm.image);
      
      await marketService.updateListing(editingListing._id, formData);
      setEditingListing(null);
      fetchListings(); // Refresh listings after update
    } catch (err) {
      setError('Failed to update listing.');
    } finally {
      setEditLoading(false);
    }
  };

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
    if (!deletingListing) return;
    try {
      setDeleteLoading(true);
      // Backend call added
      await marketService.deleteListing(deletingListing._id); 
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
      {/* Header Section */}
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

      {/* Listings Grid */}
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
                  src={item.image ? `${API_BASE}/${item.image}` : 'https://images.unsplash.com/photo-1617470702892-e01504297e15?auto=format&fit=crop&w=1200&q=80'}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm font-bold text-blue-200">₹{item.price}</p>
                </div>
                <div className="absolute right-4 top-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-full bg-blue-500/80 p-2 text-white backdrop-blur-sm transition hover:bg-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="rounded-full bg-red-500/80 p-2 text-white backdrop-blur-sm transition hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
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
                  Posted on {formatDate(item.createdAt)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <EmptyState
          title="No listings yet"
          description="You haven't posted any cars for sale. Create your first listing!"
          action={
            <Link to="/sell">
              <GradientButton><PlusCircle size={16} />Sell Your Car</GradientButton>
            </Link>
          }
        />
      )}

      {/* MODALS SECTION - Fixed outside of loops to prevent overflow issues */}
      
      {/* Edit Listing Modal */}
      <AnimatePresence>
        {editingListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setEditingListing(null)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleEditSubmit}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/60">
                  <Edit2 className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Listing</h2>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Title</label>
                    <input name="title" value={editForm.title} onChange={handleEditInput} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Price (₹)</label>
                    <input name="price" value={editForm.price} onChange={handleEditInput} required type="number" min="0" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Description</label>
                    <textarea name="description" value={editForm.description} onChange={handleEditInput} required rows="3" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Contact No</label>
                    <input name="contact" value={editForm.contact} onChange={handleEditInput} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Location</label>
                    <input name="location" value={editForm.location} onChange={handleEditInput} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Update Image (Optional)</label>
                    <input name="image" type="file" accept="image/*" onChange={handleEditInput} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setEditingListing(null)} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Listing</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Are you sure you want to delete <strong>{deletingListing.title}</strong>?</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setDeletingListing(null)} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={deleteLoading} className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
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