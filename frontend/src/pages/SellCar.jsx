// This page allows users to create a new car listing with details with image.
import { motion } from 'framer-motion';
import { ImagePlus, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import GradientButton from '../components/GradientButton';
import { marketService } from '../services/api';

// Initial form state
const initialForm = {
  title: '',
  price: '',
  description: '',
  contact: '',
  location: ''
};

// Form to create a new car listing with image upload support.
function SellCar() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes for text fields
  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  };

  // Handle form submission to create a new listing
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
// Create FormData and append form fields and image
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append('image', image);

      // Create listing
      await marketService.createListing(formData);

      setSuccess('Listing created successfully.');
      setForm(initialForm);
      setImage(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel mx-auto max-w-3xl p-8"
      >
        <h1 className="text-3xl font-bold">Sell Your Car</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create a polished listing and connect with serious buyers.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-300/70 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            {success}
          </p>
        )}

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Listing Title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Hyundai Creta SX 2022"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Price (INR)</span>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
              min="0"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Contact</span>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Phone / WhatsApp"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Location</span>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, State"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Mention key details like model year, condition, kilometers, service history."
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Car Image</span>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-6 text-center transition hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-blue-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <UploadCloud className="mx-auto h-7 w-7 text-blue-500" />
              <p className="mt-2 text-sm font-medium">
                {image ? image.name : 'Drag and drop or click to upload'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </label>

          <div className="sm:col-span-2">
            <GradientButton type="submit" disabled={loading} className="w-full">
              <ImagePlus size={16} />
              {loading ? 'Publishing...' : 'Publish Listing'}
            </GradientButton>
          </div>
        </form>
      </motion.section>
    </div>
  );
}

export default SellCar;

