import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Signup() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [displayName, setDisplayName] = useState('');
 const [loading, setLoading] = useState(false);
 const { signup, currentUser } = useAuth();
 const navigate = useNavigate();

 // Instantly redirect if already logged in
 useEffect(() => {
 if (currentUser) {
 navigate('/', { replace: true });
 }
 }, [currentUser, navigate]);

 async function handleSubmit(e) {
 e.preventDefault();
 if (loading) return;

 if (password.length < 6) {
 return toast.error('Password must be at least 6 characters long.');
 }
 
 try {
 setLoading(true);
 await signup(email, password, displayName);
 navigate('/', { replace: true });
 } catch (error) {
 toast.error(error.message);
 setLoading(false);
 }
 }

 return (
 <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="card max-w-md w-full p-8 bg-white shadow-xl rounded-2xl border border-slate-100"
 >
 <div className="text-center mb-8">
 <h2 className="text-3xl font-bold font-heading text-slate-900">
 Create Account
 </h2>
 <p className="text-slate-500 mt-2">Join AI Content Generator today</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">
 Full Name
 </label>
 <div className="relative">
 <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 required
 className="input-field pl-10 w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-xl"
 placeholder="John Doe"
 value={displayName}
 onChange={(e) => setDisplayName(e.target.value)}
 disabled={loading}
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">
 Email Address
 </label>
 <div className="relative">
 <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="email"
 required
 className="input-field pl-10 w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-xl"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 disabled={loading}
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">
 Password
 </label>
 <div className="relative">
 <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="password"
 required
 className="input-field pl-10 w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-xl"
 placeholder="••••••••"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 disabled={loading}
 />
 </div>
 </div>

 <button
 disabled={loading}
 type="submit"
 className="btn-primary w-full justify-center py-3 text-lg shadow-md hover:shadow-lg transition-all"
 >
 {loading ? 'Creating Account...' : 'Sign Up'}
 </button>
 </form>

 <p className="text-center mt-8 text-sm text-slate-500">
 Already have an account?{' '}
 <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
 Log In
 </Link>
 </p>
 </motion.div>
 </div>
 );
}
