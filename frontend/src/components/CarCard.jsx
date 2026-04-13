import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Gauge, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function CarCard({ car, onOrder }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/75"
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={car.image ? `${API_BASE}/${car.image}` : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'}
          alt={car.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">{car.name}</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">{car.brand}</p>
          </div>
          <p className="rounded-xl bg-black/50 px-3 py-1 text-sm font-semibold">₹ {car.price}</p>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-2xl bg-slate-100 p-2 text-center dark:bg-slate-800/80">
            <Zap className="mx-auto mb-1 h-4 w-4 text-indigo-500" />
            <span className="block text-[10px] text-slate-500 uppercase">Power</span>
            <span className="text-xs font-bold dark:text-white">{car.horsepower || '--'} HP</span>
          </div>
          <div className="rounded-2xl bg-slate-100 p-2 text-center dark:bg-slate-800/80">
            <Fuel className="mx-auto mb-1 h-4 w-4 text-blue-500" />
            <span className="block text-[10px] text-slate-500 uppercase">Mileage</span>
            <span className="text-xs font-bold dark:text-white">{car.mileage || '--'} km/l</span>
          </div>
          <div className="rounded-2xl bg-slate-100 p-2 text-center dark:bg-slate-800/80">
            <Gauge className="mx-auto mb-1 h-4 w-4 text-violet-500" />
            <span className="block text-[10px] text-slate-500 uppercase">Top Speed</span>
            <span className="text-xs font-bold dark:text-white">{car.top_speed || '--'} km/h</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-lg shadow-blue-500/20" 
            onClick={() => onOrder(car)}
          >
            Buy Now
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-xl transition hover:bg-slate-200 dark:hover:bg-slate-700" 
            onClick={() => setShowDetails((v) => !v)}
          >
            <span className="text-xs font-medium">{showDetails ? 'Hide Details' : 'Full Details'}</span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Expandable Details Section */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-4 text-[11px]">
                <DetailRow label="Engine" value={car.engine} />
                <DetailRow label="Torque" value={car.torque} />
                <DetailRow label="Fuel" value={car.fuel_type} />
                <DetailRow label="Trans" value={car.transmission} />
                <DetailRow label="Seats" value={car.seating_capacity} />
                <DetailRow label="Boot" value={`${car.boot_space} L`} />
                <DetailRow label="Tank" value={`${car.fuel_tank_capacity} L`} />
                <DetailRow label="Airbags" value={car.airbags} />
                <DetailRow label="Sunroof" value={car.sunroof ? 'Yes' : 'No'} />
                <DetailRow label="ABS" value={car.abs ? 'Yes' : 'No'} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

// Small helper component for the detail grid
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
      <span className="text-slate-500 font-medium">{label}:</span>
      <span className="text-slate-800 dark:text-slate-200 font-semibold">{value || '--'}</span>
    </div>
  );
}

export default CarCard;