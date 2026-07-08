import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const { resetPassword } = useAuth();

 async function handleSubmit(e) {
 e.preventDefault();
 try {
 setLoading(true);
 await resetPassword(email);
 toast.success('Password reset email sent! Check your inbox.');
 } catch (error) {
 toast.error('Failed to send reset email: ' + error.message);
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="min-h-screen flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="card max-w-md w-full p-8"
 >
 <div className="text-center mb-8">
 <h2 className="text-3xl font-bold font-heading text-slate-900 ">
 Reset Password
 </h2>
 <p className="text-slate-500 mt-2">Enter your email to get a reset link</p>
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
 className="input-field pl-10 w-full"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 />
 </div>
 </div>

 <button
 disabled={loading}
 type="submit"
 className="btn-primary w-full justify-center py-3 text-lg"
 >
 {loading ? 'Sending...' : 'Send Reset Link'}
 </button>
 </form>

 <p className="text-center mt-8 text-sm text-slate-500">
 <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
 &larr; Back to Log In
 </Link>
 </p>
 </motion.div>
 </div>
 );
}
