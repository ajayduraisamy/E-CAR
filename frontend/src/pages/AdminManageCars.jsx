// AdminManageCars.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, X, Search, CarFront, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { carService } from '../services/api';
import { showSuccess, showError } from '../utils/toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialEditForm = {
  name: '', brand: '', price: '', engine: '', horsepower: '',
  torque: '', mileage: '', top_speed: '', fuel_type: '',
  transmission: '', seating_capacity: '', boot_space: '',
  fuel_tank_capacity: '', airbags: '', abs: 'true',
  infotainment_system: '', sunroof: 'false', gps: 'true'
};

function AdminManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  
  // Edit modal state
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [editImages, setEditImages] = useState([]); // Selected files
  const [previewUrls, setPreviewUrls] = useState([]); // Previews (URLs or Blobs)
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  // Delete state
  const [deletingCar, setDeletingCar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  useEffect(() => { fetchCars(); }, []);

  // Inside your Edit Modal component
const [currentViewIndex, setCurrentViewIndex] = useState(0);

// Function to move to the next image
const nextImage = () => {
  setCurrentViewIndex((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1));
};

// Function to move to the previous image
const prevImage = () => {
  setCurrentViewIndex((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
};
  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (car) => {
    setEditingCar(car);
    setEditForm({
      name: car.name || '', brand: car.brand || '', price: car.price || '',
      engine: car.engine || '', horsepower: car.horsepower || '',
      torque: car.torque || '', mileage: car.mileage || '',
      top_speed: car.top_speed || '', fuel_type: car.fuel_type || '',
      transmission: car.transmission || '', seating_capacity: car.seating_capacity || '',
      boot_space: car.boot_space || '', fuel_tank_capacity: car.fuel_tank_capacity || '',
      airbags: car.airbags || '', abs: car.abs ? 'true' : 'false',
      infotainment_system: car.infotainment_system || '',
      sunroof: car.sunroof ? 'true' : 'false', gps: car.gps ? 'true' : 'false'
    });

    // Handle existing images for preview
    const existing = car.images?.length > 0 
      ? car.images.map(img => `${API_BASE}/${img}`) 
      : car.image ? [`${API_BASE}/${car.image}`] : [];
    
    setPreviewUrls(existing);
    setEditImages([]);
    setEditMessage('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      showError("Maximum 4 images allowed");
      return;
    }
    setEditImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleEditInput = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setEditMessage('');
    try {
      setEditLoading(true);
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => formData.append(key, value));

      if (editImages.length > 0) {
        editImages.forEach((img) => formData.append('images', img));
      }

      await carService.updateCar(editingCar._id, formData);
      showSuccess(`Car "${editForm.name}" updated 🚗`);
      fetchCars();
      setTimeout(() => setEditingCar(null), 1200);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update car.';
      showError(message);
      setEditMessage(message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await carService.deleteCar(deletingCar._id);
      showSuccess(`"${deletingCar.name}" deleted 🗑️`);
      setCars((prev) => prev.filter((c) => c._id !== deletingCar._id));
      setDeletingCar(null);
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to delete car.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <section className="glass-panel p-8 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl dark:text-white">Manage Cars</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">View, edit, and delete car listings.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm outline-none dark:text-white"
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
              className="glass-panel overflow-hidden dark:bg-slate-900 dark:border-slate-700"
            >
            <div className="relative h-48 overflow-hidden group">
  {(() => {
    const carImages = car.images?.length > 0 ? car.images : car.image ? [car.image] : [];
    const currentIndex = imageIndexes[car._id] || 0;
    return (
      <>
        <img
          src={carImages.length > 0 ? `${API_BASE}/${carImages[currentIndex]}` : 'https://images.unsplash.com/photo-1555215695-3004980ad54e'}
          alt={car.name}
          className="h-full w-full object-cover transition duration-300"
        />
        {carImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const prevIndex = currentIndex === 0 ? carImages.length - 1 : currentIndex - 1;
                setImageIndexes(prev => ({ ...prev, [car._id]: prevIndex }));
              }} 
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-slate-700"
            >
              <ChevronLeft size={18} className="dark:text-white"/>
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const nextIndex = (currentIndex + 1) % carImages.length;
                setImageIndexes(prev => ({ ...prev, [car._id]: nextIndex }));
              }} 
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-slate-700"
            >
              <ChevronRight size={18} className="dark:text-white"/>
            </button>
          </div>
        )}
      </>
    )
  })()}
  {/* Move gradient overlay here - it was covering the buttons! */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
  <div className="absolute bottom-4 left-4 text-white z-10">
    <h3 className="text-lg font-semibold">{car.name}</h3>
    <p className="text-xs uppercase tracking-wider text-white/80">{car.brand}</p>
  </div>
</div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div>Price: <span className="font-semibold dark:text-white">₹{car.price}</span></div>
                  <div>HP: <span className="font-semibold dark:text-white">{car.horsepower}</span></div>
                  <div>Mileage: <span className="font-semibold dark:text-white">{car.mileage} km/l</span></div>
                  <div>Top Speed: <span className="font-semibold dark:text-white">{car.top_speed} km/h</span></div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(car)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingCar(car)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Edit Modal - Added z-[100] to ensure it is above EVERYTHING */}
      <AnimatePresence>
        {editingCar && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setEditingCar(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">Edit Car Details</h2>
                <button type="button" onClick={() => setEditingCar(null)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* 4-Image Grid Preview Section */}
              <div className="mb-8">
                <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Previews (Max 4)</span>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                      {previewUrls[i] ? (
                        <img src={previewUrls[i]} className="h-full w-full object-cover" alt="Preview" />
                      ) : (
                        <CarFront size={24} className="text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                  <Upload size={18} />
                  <span>Upload Up to 4 Images</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <form onSubmit={handleUpdateCar} className="grid gap-4 sm:grid-cols-2">
                {Object.entries({
                  name: 'Model Name', brand: 'Brand', price: 'Price', engine: 'Engine',
                  horsepower: 'Horsepower', torque: 'Torque', mileage: 'Mileage',
                  top_speed: 'Top Speed', fuel_type: 'Fuel Type', transmission: 'Transmission',
                  seating_capacity: 'Seating Capacity', boot_space: 'Boot Space',
                  fuel_tank_capacity: 'Fuel Tank Capacity', airbags: 'Airbags',
                  infotainment_system: 'Infotainment System'
                }).map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{label}</span>
                    <input
                      name={key}
                      value={editForm[key]}
                      onChange={handleEditInput}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </label>
                ))}

                {['abs', 'sunroof', 'gps'].map(key => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{key}</span>
                    <select 
                      name={key} 
                      value={editForm[key]} 
                      onChange={handleEditInput} 
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                ))}

                <div className="sm:col-span-2 pt-6">
                  <GradientButton type="submit" disabled={editLoading} className="w-full h-12 rounded-2xl">
                    {editLoading ? 'Processing Updates...' : 'Update Car Listing'}
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setDeletingCar(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <h2 className="text-xl font-bold text-red-600">Delete Car</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Are you sure you want to delete <strong>{deletingCar.name}</strong>?
              </p>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setDeletingCar(null)} className="flex-1 py-2 rounded-xl border dark:border-slate-700 dark:text-white">Cancel</button>
                <button type="button" onClick={handleConfirmDelete} disabled={deleteLoading} className="flex-1 py-2 bg-red-600 text-white rounded-xl">
                  {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
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