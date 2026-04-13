import { motion } from 'framer-motion';
import { CarFront, LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinkClass = ({ isActive }) =>
  `group relative px-1 py-2 text-sm font-medium transition ${
    isActive
      ? 'text-blue-600 dark:text-blue-300'
      : 'text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300'
  }`;

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

 const links = useMemo(() => {
  // ❌ Not logged in
  if (!isAuthenticated) {
    return [
      { to: '/', label: 'Home' },
      { to: '/compare', label: 'Compare' }
    ];
  }

  // 👨‍💼 Admin
 if (isAdmin) {
  return [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/add-car', label: 'Add Car' },
    { to: '/admin/manage-cars', label: 'Manage Cars' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/users', label: 'Users' }
  ];
}

  // 👤 User
  return [
    { to: '/', label: 'Home' },
    { to: '/compare', label: 'Compare' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/sell', label: 'Sell Car' },
    { to: '/orders', label: 'My Orders' },
    { to: '/my-listings', label: 'My Listings' }
  ];
}, [isAuthenticated, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/55 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/55">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 p-2 text-white shadow-glow">
            <CarFront className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">E-CAR</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Premium Garage
            </p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-transform duration-300 group-hover:scale-x-100" />
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <motion.button
            whileHover={{ rotate: 12, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="rounded-2xl border border-slate-200 bg-white/70 p-2 text-slate-700 shadow-sm hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-500"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 lg:flex">
                <UserRound size={16} />
                <span>{user?.name}</span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] uppercase text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-400 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-glow"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          className="rounded-2xl border border-slate-200 bg-white/70 p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/20 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="rounded-2xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="rounded-2xl border border-red-200 px-3 py-2 text-left text-sm font-medium text-red-600 dark:border-red-900/70 dark:text-red-300"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMobileOpen(false)} className="rounded-2xl px-3 py-2 text-sm font-medium">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;
