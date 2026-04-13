import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60';

function GradientButton({
  children,
  type = 'button',
  onClick,
  to,
  className = '',
  disabled = false,
  variant = 'primary'
}) {
  const variantClasses =
    variant === 'outline'
      ? 'border border-blue-300 bg-white/70 text-blue-700 dark:border-blue-600/60 dark:bg-slate-900/60 dark:text-blue-200'
      : 'brand-gradient text-white';

  const mergedClasses = `${baseClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link to={to} className={mergedClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={mergedClasses}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

export default GradientButton;
