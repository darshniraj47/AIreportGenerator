/**
 * HistoryPanel.jsx — Generation History Sidebar
 * ────────────────────────────────────────────────
 * Shows past generated content with search, load, and delete functionality.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FiSearch, FiTrash2, FiClock, FiRefreshCw,
 FiFileText, FiAlertTriangle, FiX, FiChevronRight
} from 'react-icons/fi';
import { fetchHistory, deleteHistoryItem, deleteAllHistory } from '../../services/api';
import toast from 'react-hot-toast';

// Content type icon map
const TYPE_ICONS = {
 Report: '📊', Summary: '📋', Blog: '✍️',
 Article: '📰', Email: '📧', Assignment: '🎓',
 'Research Notes': '🔬',
};

const TONE_COLORS = {
 Professional: 'blue',
 Academic: 'purple',
 Formal: 'slate',
 Friendly: 'green',
};

export default function HistoryPanel({ onLoadHistory }) {
 const [history, setHistory] = useState([]);
 const [search, setSearch] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
 const [deletingId, setDeletingId] = useState(null);
 const [error, setError] = useState(null);

 const loadHistory = useCallback(async (searchTerm = '') => {
 setIsLoading(true);
 setError(null);
 try {
 const data = await fetchHistory(searchTerm);
 setHistory(data.history || []);
 } catch (err) {
 setError(err.message);
 } finally {
 setIsLoading(false);
 }
 }, []);

 useEffect(() => {
 loadHistory();
 }, [loadHistory]);

 // Debounced search
 useEffect(() => {
 const timer = setTimeout(() => loadHistory(search), 400);
 return () => clearTimeout(timer);
 }, [search, loadHistory]);

 const handleDelete = async (id) => {
 setDeletingId(id);
 try {
 await deleteHistoryItem(id);
 setHistory(prev => prev.filter(h => h._id !== id));
 toast.success('History item deleted.');
 } catch (err) {
 toast.error(err.message);
 } finally {
 setDeletingId(null);
 }
 };

 const handleDeleteAll = async () => {
 try {
 const result = await deleteAllHistory();
 setHistory([]);
 setConfirmDeleteAll(false);
 toast.success(`Cleared ${result.deleted_count} history items.`);
 } catch (err) {
 toast.error(err.message);
 }
 };

 const formatDate = (dateStr) => {
 const d = new Date(dateStr);
 const now = new Date();
 const diffMs = now - d;
 const diffMins = Math.floor(diffMs / 60000);
 const diffHours = Math.floor(diffMins / 60);
 const diffDays = Math.floor(diffHours / 24);

 if (diffMins < 1) return 'Just now';
 if (diffMins < 60) return `${diffMins}m ago`;
 if (diffHours < 24) return `${diffHours}h ago`;
 if (diffDays < 7) return `${diffDays}d ago`;
 return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 };

 return (
 <div className="card flex flex-col h-full overflow-hidden">
 {/* Header */}
 <div className="px-5 py-4 border-b border-slate-200 ">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <FiClock className="text-primary-500" size={16} />
 <h3 className="section-title">History</h3>
 {history.length > 0 && (
 <span className="badge-primary">{history.length}</span>
 )}
 </div>

 <div className="flex items-center gap-1.5">
 {/* Refresh */}
 <button
 onClick={() => loadHistory(search)}
 className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500
 hover:bg-slate-100 :bg-slate-800 transition-colors"
 title="Refresh history"
 >
 <motion.div
 animate={isLoading ? { rotate: 360 } : {}}
 transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
 >
 <FiRefreshCw size={14} />
 </motion.div>
 </button>

 {/* Clear all */}
 {history.length > 0 && (
 <button
 onClick={() => setConfirmDeleteAll(true)}
 className="p-1.5 rounded-lg text-slate-400 hover:text-red-500
 hover:bg-red-50 :bg-red-900/20 transition-colors"
 title="Clear all history"
 >
 <FiTrash2 size={14} />
 </button>
 )}
 </div>
 </div>

 {/* Search */}
 <div className="relative">
 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
 <input
 type="text"
 placeholder="Search history..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 className="input-field pl-8 pr-8 py-2 text-sm"
 />
 {search && (
 <button
 onClick={() => setSearch('')}
 className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400
 hover:text-slate-600 transition-colors"
 >
 <FiX size={13} />
 </button>
 )}
 </div>
 </div>

 {/* Confirm delete all */}
 <AnimatePresence>
 {confirmDeleteAll && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="bg-red-50 border-b border-red-200 px-4 py-3"
 >
 <div className="flex items-start gap-2">
 <FiAlertTriangle className="text-red-500 mt-0.5 shrink-0" size={15} />
 <div className="flex-1">
 <p className="text-sm font-medium text-red-700 ">
 Delete all history?
 </p>
 <p className="text-xs text-red-500 mt-0.5">This cannot be undone.</p>
 </div>
 <div className="flex gap-1.5 shrink-0">
 <button
 onClick={handleDeleteAll}
 className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium
 hover:bg-red-600 transition-colors"
 >
 Delete
 </button>
 <button
 onClick={() => setConfirmDeleteAll(false)}
 className="px-3 py-1 rounded-lg bg-white text-slate-600 
 text-xs border border-slate-200 hover:bg-slate-50"
 >
 Cancel
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* History list */}
 <div className="flex-1 overflow-y-auto">
 {isLoading && history.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-10 text-slate-400">
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
 className="mb-3"
 >
 <FiRefreshCw size={20} />
 </motion.div>
 <span className="text-sm">Loading history...</span>
 </div>
 ) : error ? (
 <div className="p-5 text-center">
 <FiAlertTriangle className="text-amber-400 mx-auto mb-2" size={24} />
 <p className="text-sm text-slate-500 ">{error}</p>
 <p className="text-xs text-slate-400 mt-1">Check if MongoDB is connected</p>
 </div>
 ) : history.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
 <div className="w-12 h-12 rounded-2xl bg-slate-100 
 flex items-center justify-center mb-3">
 <FiFileText className="text-slate-400" size={20} />
 </div>
 <p className="text-sm font-medium text-slate-500 ">
 {search ? 'No results found' : 'No history yet'}
 </p>
 <p className="text-xs text-slate-400 mt-1">
 {search ? 'Try a different search term' : 'Generate content to see it here'}
 </p>
 </div>
 ) : (
 <div className="divide-y divide-slate-100 ">
 <AnimatePresence>
 {history.map((item, i) => (
 <motion.div
 key={item._id}
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ delay: i * 0.03 }}
 className="group relative px-4 py-3.5 hover:bg-slate-50 :bg-slate-800/50
 transition-colors cursor-pointer"
 onClick={() => onLoadHistory(item)}
 >
 <div className="flex items-start gap-3">
 {/* Icon */}
 <span className="text-xl shrink-0 mt-0.5">
 {TYPE_ICONS[item.content_type] || '📄'}
 </span>

 {/* Content */}
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-slate-800 
 truncate group-hover:text-primary-600 :text-primary-400
 transition-colors">
 {item.topic}
 </p>
 <div className="flex items-center gap-2 mt-1 flex-wrap">
 <span className="text-xs text-slate-400">{item.content_type}</span>
 <span className="text-slate-300 ">·</span>
 <span className="text-xs text-slate-400">
 {item.actual_word_count?.toLocaleString()} words
 </span>
 <span className="text-slate-300 ">·</span>
 <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleDelete(item._id);
 }}
 disabled={deletingId === item._id}
 className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 :bg-red-900/20
 hover:text-red-500 transition-colors"
 title="Delete"
 >
 {deletingId === item._id ? (
 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
 <FiRefreshCw size={12} />
 </motion.div>
 ) : (
 <FiTrash2 size={12} />
 )}
 </button>
 <FiChevronRight size={14} className="text-slate-300 " />
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}
 </div>
 </div>
 );
}
