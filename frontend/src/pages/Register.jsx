// This file defines the Register component, which provides a user interface for new users to create an account on the E-CAR platform. It includes form fields for name, email, password, and role selection, along with error handling and loading states during the registration process.
import { motion } from 'framer-motion';
import { showSuccess, showError } from '../utils/toast';
import { KeyRound, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

// Register component
function Register() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  // Form state and handlers
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  try {
    setLoading(true);

    const { data } = await authService.register(form);

  
    showSuccess("Registration successful 🎉");

    // save auth
    saveAuth(data);

   
    setTimeout(() => {
      navigate(
        data?.user?.role === 'admin' ? '/admin' : '/',
        { replace: true }
      );
    }, 1500);

  } catch (err) {
    const message =
      err?.response?.data?.message ||
      'Registration failed. Please try again.';

    
    showError(message);

    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-[78vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-xl p-8"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
          Get Started
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create Your E-CAR Account</h1>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-300/70 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Full Name</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 focus-within:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70">
              <UserRound size={16} className="text-slate-500" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="h-11 w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 focus-within:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70">
              <Mail size={16} className="text-slate-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="h-11 w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 focus-within:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70">
              <KeyRound size={16} className="text-slate-500" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="h-11 w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900/70"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="sm:col-span-2">
            <GradientButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Register'}
            </GradientButton>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-300">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;

