/**
 * Dashboard.jsx — Main Application Layout
 * ──────────────────────────────────────────
 * Three-column responsive layout:
 * [Left: Generator Form] [Center: Content Display] [Right: History]
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContent } from '../../services/api';
import GeneratorForm from './GeneratorForm';
import PromptPreview from './PromptPreview';
import ContentDisplay from './ContentDisplay';
import HistoryPanel from './HistoryPanel';
import Navbar from '../UI/Navbar';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// Sidebar tabs for mobile
const SIDEBAR_TABS = [
 { id: 'generate', label: 'Generate', icon: '⚡' },
 { id: 'history', label: 'History', icon: '📜' },
];

export default function Dashboard() {
 const { currentUser } = useAuth();
 const [result, setResult] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [promptPreview, setPromptPreview] = useState(null);
 const [lastParams, setLastParams] = useState(null);
 const [mobileTab, setMobileTab] = useState('generate');
 const [isHistoryOpen, setIsHistoryOpen] = useState(false);

 // ── Generate content ──────────────────────────────────────────────────────────
 const handleGenerate = useCallback(async (params) => {
 setIsLoading(true);
 setLastParams(params);
 setResult(null); // Clear previous content

 try {
 const data = await generateContent(params);
 setResult(data);
 toast.success('Content generated successfully! ✨', { duration: 3000 });
 } catch (err) {
 toast.error(err.message || 'Failed to generate content. Check your API key and backend.', {
 duration: 5000,
 });
 } finally {
 setIsLoading(false);
 }
 }, []);

 // ── Regenerate (same params) ────────────────────────────────────────────────
 const handleRegenerate = useCallback(async () => {
 if (!lastParams) return;
 await handleGenerate(lastParams);
 }, [lastParams, handleGenerate]);

 // ── Load from history ───────────────────────────────────────────────────────
 const handleLoadHistory = useCallback((historyItem) => {
 setResult({
 content: historyItem.content,
 topic: historyItem.topic,
 content_type: historyItem.content_type,
 tone: historyItem.tone,
 word_count: historyItem.actual_word_count,
 reading_time_minutes: Math.round(historyItem.actual_word_count / 200 * 10) / 10,
 history_id: historyItem._id,
 });
 toast.success('Loaded from history!');
 // On mobile, switch to content view
 if (window.innerWidth < 1024) setMobileTab('generate');
 }, []);

 return (
 <div className="min-h-screen bg-[var(--bg-base)]">
 {/* Navbar */}
 <Navbar
 onHistoryToggle={() => setIsHistoryOpen(prev => !prev)}
 />

 {/* ── Background decorative elements ── */}
 <div className="fixed inset-0 pointer-events-none overflow-hidden">
 <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
 <div className="absolute top-40 right-20 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
 <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
 </div>

 {/* ── Main Content (offset for fixed navbar) ── */}
 <main className="relative pt-16 min-h-screen">



 {/* ── Desktop & Mobile 2-Column Layout ── */}
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
 
 {/* Header (Moved above grid for perfect vertical alignment) */}
 <div className="space-y-4 mb-8">
 <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold font-heading text-slate-900 tracking-tight">
 Welcome, {currentUser?.displayName || 'User'}!
 </h1>
 <p className="text-base text-slate-500 max-w-xl">
 Generate professional AI-powered reports, summaries, and documents.
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
 
 {/* Left Column: Generator Form */}
 <div className="w-full">
 <GeneratorForm
 onGenerate={handleGenerate}
 onPromptPreview={setPromptPreview}
 isLoading={isLoading}
 />
 </div>

 {/* Right Column: Content Display */}
 <div className="w-full lg:sticky lg:top-24 min-h-[400px]">
 <AnimatePresence mode="wait">
 <motion.div
 key={result ? 'content' : 'empty'}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="w-full h-full"
 >
 <ContentDisplay
 result={result}
 isLoading={isLoading}
 onRegenerate={lastParams ? handleRegenerate : null}
 onClose={() => setResult(null)}
 />
 </motion.div>
 </AnimatePresence>
 </div>
 
 </div>
 </div>

 {/* History Drawer */}
 <AnimatePresence>
 {isHistoryOpen && (
 <motion.div
 initial={{ opacity: 0, x: '100%' }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: '100%' }}
 transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
 className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 border-l border-slate-200 "
 >
 <div className="h-full pt-16 flex flex-col">
 <div className="p-4 flex items-center justify-between border-b border-slate-200 ">
 <h2 className="text-lg font-semibold font-heading">History</h2>
 <button onClick={() => setIsHistoryOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 :text-white transition-colors">
 Close
 </button>
 </div>
 <div className="flex-1 overflow-y-auto">
 <HistoryPanel onLoadHistory={(item) => { handleLoadHistory(item); setIsHistoryOpen(false); }} />
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </main>
 </div>
 );
}
