import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import GradientButton from '../components/GradientButton';
import CarCard from '../components/CarCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { carService } from '../services/api';

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: 'Trusted Listings',
    description: 'Every listing goes through a clean and transparent data flow.'
  },
  {
    icon: Zap,
    title: 'Smart Comparison',
    description: 'Compare key performance specs instantly before you decide.'
  },
  {
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'High-end UI and smooth interactions crafted for speed and confidence.'
  }
];

function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await carService.getCars();
        setCars(data.slice(0, 6));
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load featured cars.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="space-y-16 pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-hero-grid p-8 shadow-2xl sm:p-12">
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-blue-200 bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-blue-500/30 dark:bg-slate-900/40 dark:text-blue-300"
          >
            Car Comparison & Marketplace
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 text-4xl font-bold leading-tight sm:text-5xl"
          >
            Discover, Compare and Sell Cars with a{' '}
            <span className="text-brand-gradient">Premium Digital Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-2xl text-base text-slate-700 dark:text-slate-300 sm:text-lg"
          >
            E-CAR helps you make faster and smarter car decisions with elegant comparison tools,
            trusted listings, and a seamless marketplace journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <GradientButton to="/marketplace">
              Explore Cars <ArrowRight size={16} />
            </GradientButton>
            <GradientButton to="/compare" variant="outline">
              Compare Models
            </GradientButton>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Featured Cars</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Curated models from the latest additions.
          </p>
        </div>

        {loading && <LoadingSpinner label="Loading featured cars..." />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && cars.length === 0 && (
          <EmptyState title="No featured cars yet" description="Admin can add cars from dashboard." />
        )}
        {!loading && !error && cars.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/60 sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Why Choose E-CAR</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index }}
              className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900/80"
            >
              <div className="mb-4 w-fit rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 p-2.5 text-white shadow-glow">
                <item.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
