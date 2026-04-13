import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Compare from './pages/Compare';
import Marketplace from './pages/Marketplace';
import SellCar from './pages/SellCar';
import AdminDashboard from './pages/AdminDashboard';
import Orders from "./pages/Orders";
import MyListings from "./pages/MyListings";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminAddCar from "./pages/AdminAddCar";
import AdminManageCars from "./pages/AdminManageCars";


const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const PageShell = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const NotFound = () => (
  <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/70 bg-white/70 p-10 text-center shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
    <h1 className="text-3xl font-bold">Page Not Found</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-300">
      The page you requested does not exist.
    </p>
  </div>
);

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PageShell><Home /></PageShell>} />
          <Route path="/login" element={<PageShell><Login /></PageShell>} />
          <Route path="/register" element={<PageShell><Register /></PageShell>} />
          <Route path="/compare" element={<PageShell><Compare /></PageShell>} />
          <Route path="/marketplace" element={<PageShell><Marketplace /></PageShell>} />
          <Route path="/orders" element={<PageShell><Orders /></PageShell>} />
          <Route path="/my-listings" element={<PageShell><MyListings /></PageShell>} />
          <Route path="/admin/orders" element={<PageShell><AdminOrders /></PageShell>} />
          <Route path="/admin/users" element={<PageShell><AdminUsers /></PageShell>} />
          <Route path="/admin/add-car" element={<PageShell><AdminAddCar /></PageShell>} />
          <Route path="/admin/manage-cars" element={<PageShell><AdminManageCars /></PageShell>} />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <PageShell><SellCar /></PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <PageShell><AdminDashboard /></PageShell>
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<PageShell><NotFound /></PageShell>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;

