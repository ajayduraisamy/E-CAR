import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import GradientButton from '../components/GradientButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { carService } from '../services/api';

const specMeta = [
  { key: 'price', label: 'Price', suffix: '' },
  { key: 'horsepower', label: 'Horsepower', suffix: 'HP' },
  { key: 'mileage', label: 'Mileage', suffix: 'km/l' },
  { key: 'top_speed', label: 'Top Speed', suffix: 'km/h' }
];

function Compare() {
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState('');
  const [selectedCar2, setSelectedCar2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoadingCars(true);
        setError('');
        const { data } = await carService.getCars();
        setCars(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load cars.');
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

  const isCompareDisabled = useMemo(
    () => !selectedCar1 || !selectedCar2 || selectedCar1 === selectedCar2 || loadingCompare,
    [selectedCar1, selectedCar2, loadingCompare]
  );

  const handleCompare = async () => {
    try {
      setLoadingCompare(true);
      setError('');
      const { data } = await carService.compareCars(selectedCar1, selectedCar2);
      setComparisonResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Comparison failed. Please try again.');
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Compare Cars</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Select any two cars and get a side-by-side performance breakdown.
        </p>

        {loadingCars ? (
          <LoadingSpinner label="Loading cars..." />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto] md:items-end">
            <label className="space-y-2">
              <span className="text-sm font-medium">Car 1</span>
              <select
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                value={selectedCar1}
                onChange={(event) => setSelectedCar1(event.target.value)}
              >
                <option value="">Select first car</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.brand} - {car.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-center">
              <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 p-3 text-white shadow-glow">
                <ArrowRightLeft size={18} />
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium">Car 2</span>
              <select
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
                value={selectedCar2}
                onChange={(event) => setSelectedCar2(event.target.value)}
              >
                <option value="">Select second car</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.brand} - {car.name}
                  </option>
                ))}
              </select>
            </label>

            <GradientButton onClick={handleCompare} disabled={isCompareDisabled} className="h-11">
              {loadingCompare ? 'Comparing...' : 'Compare'}
            </GradientButton>
          </div>
        )}
      </section>

      {error && <ErrorState message={error} />}

      {!comparisonResult && !loadingCompare && !error && (
        <EmptyState
          title="Comparison data will appear here"
          description="Pick two cars and click Compare to view detailed results."
        />
      )}

      {comparisonResult && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden p-6"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3">Specification</th>
                  <th className="px-4 py-3">{comparisonResult.cars[0]?.name}</th>
                  <th className="px-4 py-3">{comparisonResult.cars[1]?.name}</th>
                  <th className="px-4 py-3">Winner</th>
                </tr>
              </thead>
              <tbody>
                {specMeta.map((spec) => {
                  const row = comparisonResult.comparison?.[spec.key];
                  const car1Name = comparisonResult.cars[0]?.name;
                  const car2Name = comparisonResult.cars[1]?.name;
                  const better = row?.better;

                  const cellClass = (carName) => {
                    if (better === 'tie') return 'text-slate-600 dark:text-slate-300';
                    return better === carName
                      ? 'font-semibold text-emerald-600 dark:text-emerald-300'
                      : 'text-rose-500 dark:text-rose-300';
                  };

                  return (
                    <tr key={spec.key} className="border-b border-slate-100 dark:border-slate-800/70">
                      <td className="px-4 py-3 font-medium">{spec.label}</td>
                      <td className={`px-4 py-3 ${cellClass(car1Name)}`}>
                        {row?.car1} {spec.suffix}
                      </td>
                      <td className={`px-4 py-3 ${cellClass(car2Name)}`}>
                        {row?.car2} {spec.suffix}
                      </td>
                      <td className="px-4 py-3">
                        {better === 'tie' ? (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs dark:bg-slate-700">
                            Tie
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            {better}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-200">
            <span className="font-semibold">Summary:</span> {comparisonResult.summary}
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default Compare;

