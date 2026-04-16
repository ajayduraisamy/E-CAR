// This file is part of E-CAR project (e-car-frontend)
import { motion } from 'framer-motion';
import { KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { showSuccess, showError } from '../utils/toast';

// Login page with form validation and error handling.
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/';

  // Handle input changes for email and password fields.
  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  //// Handle form submission for login, including API call and error handling.
  const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  try {
    setLoading(true);

    const { data } = await authService.login(form);

  
    showSuccess("Login successful ");

    saveAuth(data);

    
    setTimeout(() => {
      navigate(
        data?.user?.role === 'admin' ? '/admin' : from,
        { replace: true }
      );
    }, 1500);

  } catch (err) {
    const message =
      err?.response?.data?.message ||
      'Login failed. Please try again.';

   
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
        className="glass-panel w-full max-w-md p-8"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
          Welcome Back
        </p>
        <h1 className="mt-2 text-3xl font-bold">Login to E-CAR</h1>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-300/70 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
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
                placeholder="Enter your password"
                className="h-11 w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>

          <GradientButton type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Login'}
          </GradientButton>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-300">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

