import { motion } from 'framer-motion';
import { CarFront, UsersRound, ShoppingCart, DollarSign, List } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { carService, marketService, orderService, userService } from '../services/api';

function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //  FETCH ALL DATA
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        { data: carData },
        { data: listingData },
        { data: orderData },
        { data: userData }
      ] = await Promise.all([
        carService.getCars(),
        marketService.getListings(),
        orderService.getAllOrders(),  
        userService.getUsers()        
      ]);

      setCars(carData);
      setListings(listingData);
      setOrders(orderData);
      setUsers(userData);

    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  //  CALCULATE STATS
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    return {
      totalCars: cars.length,
      totalListings: listings.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue
    };
  }, [cars, listings, users, orders]);

  return (
    <div className="space-y-4 pb-4">

      {/* HEADER */}
      <section className="glass-panel p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Monitor system statistics and platform performance.
        </p>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL CARS */}
          <motion.div 
    whileHover={{ scale: 1.03 }} 
    className="glass-panel p-8 min-h-[180px] flex flex-col justify-between"
  >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500">Total Cars</p>
              <CarFront className="text-blue-500" size={20} />
            </div>
            <h2 className="text-3xl font-bold">{stats.totalCars}</h2>
          </motion.div>

          {/* LISTINGS */}
          <motion.div 
    whileHover={{ scale: 1.03 }} 
    className="glass-panel p-8 min-h-[180px] flex flex-col justify-between"
  >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500">Listings</p>
              <List className="text-indigo-500" size={20} />
            </div>
            <h2 className="text-3xl font-bold">{stats.totalListings}</h2>
          </motion.div>

          {/* USERS */}
          <motion.div 
    whileHover={{ scale: 1.03 }} 
    className="glass-panel p-8 min-h-[180px] flex flex-col justify-between"
  >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500">Users</p>
              <UsersRound className="text-violet-500" size={20} />
            </div>
            <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
          </motion.div>

          {/* ORDERS */}
        <motion.div 
    whileHover={{ scale: 1.03 }} 
    className="glass-panel p-8 min-h-[180px] flex flex-col justify-between"
  >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500">Orders</p>
              <ShoppingCart className="text-green-500" size={20} />
            </div>
            <h2 className="text-3xl font-bold">{stats.totalOrders}</h2>
          </motion.div>

          {/* REVENUE */}
       <motion.div 
    whileHover={{ scale: 1.03 }} 
    className="glass-panel p-8 min-h-[180px] flex flex-col justify-between"
  >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-500">Revenue</p>
              <DollarSign className="text-yellow-500" size={20} />
            </div>
            <h2 className="text-3xl font-bold">₹{stats.totalRevenue}</h2>
          </motion.div>

        </section>
      )}
    </div>
  );
}

export default AdminDashboard;