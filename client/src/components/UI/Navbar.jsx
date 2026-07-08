/**
 * Navbar.jsx — Top Navigation Bar
 * ─────────────────────────────────
 * Displays app name, user info, and theme toggle.
 */

import { motion } from 'framer-motion';
import { FiClock, FiFeather, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onHistoryToggle, hideHistory }) {
 const { currentUser, logout } = useAuth();
 const navigate = useNavigate();

 const handleLogout = async () => {
 await logout();
 navigate('/login');
 };
 const [backendStatus] = useState('online'); // Could be wired to health check

 return (
 <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 lg:px-6
 bg-white/80 backdrop-blur-md
 border-b border-slate-200/60 ">

 {/* Left: Logo */}
 <div className="flex items-center gap-3">

 {/* Logo */}
 <div className="flex items-center gap-2.5">
 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
 {/* The user's custom logo will load from public/logo.png */}
 <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
 </div>
 <div className="hidden sm:block">
 <span className="font-bold text-slate-900 text-sm leading-tight block">
 AI Report Generator
 </span>
 </div>
 </div>
 </div>

 {/* Spacer */}
 <div className="flex-1" />

 {/* Right: Controls */}
 <div className="flex items-center gap-2">

 {/* Status indicator */}
 <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
 bg-emerald-50 border border-emerald-200 ">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-xs font-medium text-emerald-600 ">
 System Online
 </span>
 </div>

 {/* History Toggle */}
 {!hideHistory && currentUser && (
 <button
 onClick={onHistoryToggle}
 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 :text-primary-400 hover:bg-primary-50 :bg-primary-900/20 rounded-xl transition-all border border-slate-200 "
 >
 <FiClock className="w-4 h-4" />
 <span className="hidden sm:inline">History</span>
 </button>
 )}

 {currentUser ? (
 <div className="flex items-center gap-3 ml-2 border-l border-slate-200 pl-4">
 <Link
 to="/settings"
 className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all border border-slate-200 "
 title="Settings"
 >
 <FiSettings className="w-5 h-5" />
 </Link>
 <button
 onClick={handleLogout}
 className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all border border-red-100 "
 title="Log Out"
 >
 <FiLogOut className="w-5 h-5" />
 </button>
 </div>
 ) : (
 <Link
 to="/login"
 className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-sm"
 >
 <FiUser className="w-4 h-4" />
 Log In
 </Link>
 )}
 </div>
 </header>
 );
}
