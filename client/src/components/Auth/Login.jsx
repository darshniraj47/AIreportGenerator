import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const { login, signInWithGoogle, currentUser } = useAuth();
 const navigate = useNavigate();

 // Instantly redirect if already logged in
 useEffect(() => {
 if (currentUser) {
 navigate('/', { replace: true });
 }
 }, [currentUser, navigate]);

 async function handleSubmit(e) {
 e.preventDefault();
 if (loading) return; // Prevent multiple requests

 try {
 setLoading(true);
 await login(email, password);
 // Removed unnecessary toast to make it feel instantly fast
 navigate('/', { replace: true });
 } catch (error) {
 toast.error(error.message);
 setLoading(false);
 }
 }

 async function handleGoogleLogin() {
 if (loading) return;
 try {
 setLoading(true);
 await signInWithGoogle();
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
 Welcome Back
 </h2>
 <p className="text-slate-500 mt-2">Log in to continue to AI Generator</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
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
 <div className="text-right mt-1">
 <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
 Forgot Password?
 </Link>
 </div>
 </div>

 <button
 disabled={loading}
 type="submit"
 className="btn-primary w-full justify-center py-3 text-lg shadow-md hover:shadow-lg transition-all"
 >
 {loading ? 'Authenticating...' : 'Log In'}
 </button>
 </form>

 <div className="my-6 flex items-center">
 <div className="flex-1 border-t border-slate-200"></div>
 <span className="px-4 text-sm text-slate-400 font-medium">Or continue with</span>
 <div className="flex-1 border-t border-slate-200"></div>
 </div>

 <button
 onClick={handleGoogleLogin}
 disabled={loading}
 className="w-full flex items-center justify-center py-3 px-4 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
 >
 <FcGoogle size={24} className="mr-3" />
 Continue with Google
 </button>

 <p className="text-center mt-8 text-sm text-slate-500">
 Don't have an account?{' '}
 <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
 Sign Up
 </Link>
 </p>
 </motion.div>
 </div>
 );
}
