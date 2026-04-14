// AdminManageCars.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, X, Search, CarFront } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { carService } from '../services/api';

// For simplicity, we're using the same form for editing. In a real app, you might want to separate this into its own component and handle both add/edit logic there.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Initial form state for editing a car
const initialEditForm = {
  name: '',
  brand: '',
  price: '',
  engine: '',
  horsepower: '',
  torque: '',
  mileage: '',
  top_speed: '',
  fuel_type: '',
  transmission: '',
  seating_capacity: '',
  boot_space: '',
  fuel_tank_capacity: '',
  airbags: '',
  abs: 'true',
  infotainment_system: '',
  sunroof: 'false',
  gps: 'true'
};

// Note: This component focuses on editing and deleting cars. Adding new cars can be handled in a separate component or by reusing the edit form with some adjustments.
function AdminManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit modal state
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [editImage, setEditImage] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  // Delete confirmation state
  const [deletingCar, setDeletingCar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch cars from the backend
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await carService.getCars();
      setCars(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load cars.');
    } finally {
      setLoading(false);
    }
  };
// Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  // Filter cars based on search term
  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit button click - populate form with existing car data
  const handleEditClick = (car) => {
    setEditingCar(car);
    setEditForm({
      name: car.name || '',
      brand: car.brand || '',
      price: car.price || '',
      engine: car.engine || '',
      horsepower: car.horsepower || '',
      torque: car.torque || '',
      mileage: car.mileage || '',
      top_speed: car.top_speed || '',
      fuel_type: car.fuel_type || '',
      transmission: car.transmission || '',
      seating_capacity: car.seating_capacity || '',
      boot_space: car.boot_space || '',
      fuel_tank_capacity: car.fuel_tank_capacity || '',
      airbags: car.airbags || '',
      abs: car.abs ? 'true' : 'false',
      infotainment_system: car.infotainment_system || '',
      sunroof: car.sunroof ? 'true' : 'false',
      gps: car.gps ? 'true' : 'false'
    });
    setEditImage(null);
    setEditMessage('');
  };

  // Handle form input changes for editing
  const handleEditInput = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission for updating a car
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setEditMessage('');

    try {
      setEditLoading(true);
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => formData.append(key, value));
      if (editImage) formData.append('image', editImage);

      await carService.updateCar(editingCar._id, formData);
      setEditMessage('Car updated successfully.');
      fetchCars();
      setTimeout(() => {
        setEditingCar(null);
      }, 1500);
    } catch (err) {
      setEditMessage(err?.response?.data?.message || 'Failed to update car.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete button click - show confirmation modal
  const handleDeleteClick = (car) => {
    setDeletingCar(car);
  };

  // Handle confirm deletion
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await carService.deleteCar(deletingCar._id);
      setCars((prev) => prev.filter((c) => c._id !== deletingCar._id));
      setDeletingCar(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete car.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section className="glass-panel p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Manage Cars</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              View, edit, and delete car listings in the system.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/70">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading cars..." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car, index) => (
            <motion.article
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    car.image
                      ? `${API_BASE}/${car.image}`
                      : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={car.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-white/80">{car.brand}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <div>Price: <span className="font-semibold">₹{car.price}</span></div>
                  <div>HP: <span className="font-semibold">{car.horsepower}</span></div>
                  <div>Mileage: <span className="font-semibold">{car.mileage} km/l</span></div>
                  <div>Top Speed: <span className="font-semibold">{car.top_speed} km/h</span></div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(car)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(car)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {!loading && filteredCars.length === 0 && (
        <div className="text-center py-12">
          <CarFront size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No cars found</h3>
          <p className="text-slate-500">{searchTerm ? 'Try a different search term' : 'Add some cars to get started'}</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setEditingCar(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Car</h2>
                <button
                  onClick={() => setEditingCar(null)}
                  className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {editMessage && (
                <p className={`mb-4 rounded-2xl px-4 py-2 text-sm ${
                  editMessage.includes('success') 
                    ? 'border border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border border-red-300/70 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300'
                }`}>
                  {editMessage}
                </p>
              )}

              <form onSubmit={handleUpdateCar} className="grid gap-4 sm:grid-cols-2">
                {Object.entries({
                  name: 'Model Name',
                  brand: 'Brand',
                  price: 'Price',
                  engine: 'Engine',
                  horsepower: 'Horsepower',
                  torque: 'Torque',
                  mileage: 'Mileage',
                  top_speed: 'Top Speed',
                  fuel_type: 'Fuel Type',
                  transmission: 'Transmission',
                  seating_capacity: 'Seating Capacity',
                  boot_space: 'Boot Space',
                  fuel_tank_capacity: 'Fuel Tank Capacity',
                  airbags: 'Airbags',
                  infotainment_system: 'Infotainment System'
                }).map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
                    <input
                      type={['price', 'horsepower', 'mileage', 'top_speed', 'seating_capacity', 'boot_space', 'fuel_tank_capacity', 'airbags'].includes(key) ? 'number' : 'text'}
                      name={key}
                      value={editForm[key]}
                      onChange={handleEditInput}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                      required
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">ABS</span>
                  <select
                    name="abs"
                    value={editForm.abs}
                    onChange={handleEditInput}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Sunroof</span>
                  <select
                    name="sunroof"
                    value={editForm.sunroof}
                    onChange={handleEditInput}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">GPS</span>
                  <select
                    name="gps"
                    value={editForm.gps}
                    onChange={handleEditInput}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Car Image (optional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                    className="block w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
                  />
                </label>

                <div className="sm:col-span-2">
                  <GradientButton type="submit" disabled={editLoading} className="w-full">
                    {editLoading ? 'Updating...' : 'Update Car'}
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setDeletingCar(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Car</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Are you sure you want to delete <strong>{deletingCar.name}</strong>? This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeletingCar(null)}
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

export default AdminManageCars;