import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-300">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <LoaderCircle className="h-9 w-9" />
      </motion.div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export default LoadingSpinner;

