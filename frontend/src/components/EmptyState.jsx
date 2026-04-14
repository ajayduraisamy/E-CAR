import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

// A reusable component to display an empty state when no data is found.
function EmptyState({ title = 'No Data Found', description = 'Try again with different filters.' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel mx-auto flex max-w-xl flex-col items-center gap-3 p-8 text-center"
    >
   
      <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
        <SearchX className="h-7 w-7 text-indigo-500" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </motion.div>
  );
}

// export the component for use in other parts of the application.
export default EmptyState;

