import { motion } from 'framer-motion';
import { Fuel, Gauge, Zap } from 'lucide-react';

function CarCard({ car }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/75"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={car.image ? `http://localhost:5000/${car.image}` : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'}
          alt={car.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">{car.name}</h3>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">{car.brand}</p>
          </div>
          <p className="rounded-xl bg-black/50 px-3 py-1 text-sm font-semibold">INR {car.price}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 text-xs text-slate-600 dark:text-slate-300">
        <div className="rounded-2xl bg-slate-100 p-3 text-center dark:bg-slate-800/80">
          <Zap className="mx-auto mb-1 h-4 w-4 text-indigo-500" />
          {car.horsepower || '--'} HP
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-center dark:bg-slate-800/80">
          <Fuel className="mx-auto mb-1 h-4 w-4 text-blue-500" />
          {car.mileage || '--'} km/l
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-center dark:bg-slate-800/80">
          <Gauge className="mx-auto mb-1 h-4 w-4 text-violet-500" />
          {car.top_speed || '--'} km/h
        </div>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl">
  Buy Now
</button>
      </div>
  
    </motion.article>
  );
}

export default CarCard;
