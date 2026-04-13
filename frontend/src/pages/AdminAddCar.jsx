import { motion } from 'framer-motion';

import { useEffect, useMemo, useState } from 'react';

import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';

import { carService, marketService } from '../services/api';

const initialCarForm = {
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

function AdminAddCar() {
  const [cars, setCars] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [carForm, setCarForm] = useState(initialCarForm);
  const [carImage, setCarImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [{ data: carData }, { data: listingData }] = await Promise.all([
        carService.getCars(),
        marketService.getListings()
      ]);
      setCars(carData);
      setListings(listingData);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const uniqueSellers = new Set(listings.map((item) => item?.user?._id || item?.user)).size;
    return {
      totalCars: cars.length,
      totalListings: listings.length,
      totalSellers: uniqueSellers
    };
  }, [cars, listings]);

  const handleCarInput = (event) => {
    setCarForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreateCar = async (event) => {
    event.preventDefault();
    setFormMessage('');
    setError('');

    try {
      setFormLoading(true);
      const formData = new FormData();
      Object.entries(carForm).forEach(([key, value]) => formData.append(key, value));
      if (carImage) formData.append('image', carImage);

      await carService.addCar(formData);
      setCarForm(initialCarForm);
      setCarImage(null);
      setFormMessage('Car added successfully.');
      fetchDashboardData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to add car.');
    } finally {
      setFormLoading(false);
    }
  };



  return (
    <div className="space-y-8 pb-8">
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Add Cars</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          
        </p>
      </section>

      {error && <ErrorState message={error} />}

    

      <section className="grid gap-8 ">
        <motion.form
          onSubmit={handleCreateCar}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel grid gap-4 p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <h2 className="text-xl font-bold">Add New Car</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Fill all required car specifications.</p>
          </div>

          {formMessage && (
            <p className="sm:col-span-2 rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              {formMessage}
            </p>
          )}

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
                type={
                  ['price', 'horsepower', 'mileage', 'top_speed', 'seating_capacity', 'boot_space', 'fuel_tank_capacity', 'airbags'].includes(
                    key
                  )
                    ? 'number'
                    : 'text'
                }
                name={key}
                value={carForm[key]}
                onChange={handleCarInput}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                required
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">ABS</span>
            <select
              name="abs"
              value={carForm.abs}
              onChange={handleCarInput}
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
              value={carForm.sunroof}
              onChange={handleCarInput}
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
              value={carForm.gps}
              onChange={handleCarInput}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Car Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setCarImage(event.target.files?.[0] || null)}
              className="block w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            />
          </label>

          <div className="sm:col-span-2">
            <GradientButton type="submit" disabled={formLoading} className="w-full">
              {formLoading ? 'Adding car...' : 'Add Car'}
            </GradientButton>
          </div>
        </motion.form>

        
      </section>
    </div>
  );
}

export default AdminAddCar;
