/**
 * GeneratorForm.jsx — Main Content Generation Form
 * ──────────────────────────────────────────────────
 * Handles topic selection, content type, tone, word count,
 * and triggers content generation.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FiZap, FiRefreshCw, FiChevronDown, FiSearch,
 FiEdit3, FiBook, FiTag, FiSliders
} from 'react-icons/fi';
import { generateContent, previewPrompt } from '../../services/api';
import topicsData from '../../data/topics.json';
import toast from 'react-hot-toast';

// ─── Constants ──────────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
 { value: 'Report', icon: '', desc: 'Structured formal report' },
 { value: 'Summary', icon: '', desc: 'Concise key points' },
 { value: 'Blog', icon: '', desc: 'Engaging blog post' },
 { value: 'Article', icon: '', desc: 'Informative article' },
 { value: 'Email', icon: '', desc: 'Professional email' },
 { value: 'Assignment', icon: '', desc: 'Academic assignment' },
 { value: 'Research Notes', icon: '', desc: 'Research notes' },
];

const TONES = [
 { value: 'Professional', color: 'blue' },
 { value: 'Academic', color: 'purple' },
 { value: 'Formal', color: 'slate' },
 { value: 'Friendly', color: 'green' },
];

const WORD_COUNTS = [
 { value: 300, label: '300 words', desc: 'Quick read' },
 { value: 500, label: '500 words', desc: 'Standard' },
 { value: 1000, label: '1000 words', desc: 'Detailed' },
 { value: 'custom', label: 'Custom', desc: 'Your choice' },
];

// Flatten all topics from dataset
const ALL_TOPICS = topicsData.categories.flatMap(cat =>
 cat.topics.map(t => ({ topic: t, category: cat.name, icon: cat.icon }))
);

// ─── Component ──────────────────────────────────────────────────────────────────

export default function GeneratorForm({ onGenerate, onPromptPreview, isLoading }) {
 const [topic, setTopic] = useState('');
 const [topicMode, setTopicMode] = useState('select'); // 'select' | 'custom'
 const [topicSearch, setTopicSearch] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('All');
 const [contentType, setContentType] = useState('Report');
 const [tone, setTone] = useState('Professional');
 const [wordCount, setWordCount] = useState(500);
 const [customWordCount, setCustomWordCount] = useState('');
 const [customInstructions, setCustomInstructions] = useState('');
 const [showTopicDropdown, setShowTopicDropdown] = useState(false);

 // Filter topics based on search and category
 const filteredTopics = ALL_TOPICS.filter(item => {
 const matchesSearch = item.topic.toLowerCase().includes(topicSearch.toLowerCase());
 const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
 return matchesSearch && matchesCategory;
 });

 const categories = ['All', ...topicsData.categories.map(c => c.name)];

 // Compute effective word count
 const effectiveWordCount = wordCount === 'custom'
 ? parseInt(customWordCount) || 500
 : wordCount;

 // Auto-preview prompt when inputs change
 useEffect(() => {
 if (!topic) return;
 const timer = setTimeout(async () => {
 try {
 const preview = await previewPrompt({
 topic,
 content_type: contentType,
 tone,
 word_count: effectiveWordCount,
 custom_instructions: customInstructions || undefined,
 });
 onPromptPreview(preview);
 } catch {
 // Silently ignore preview errors
 }
 }, 800);
 return () => clearTimeout(timer);
 }, [topic, contentType, tone, effectiveWordCount, customInstructions]);

 const handleGenerate = async () => {
 if (!topic.trim()) {
 toast.error('Please enter or select a topic first.');
 return;
 }
 if (wordCount === 'custom' && (!customWordCount || isNaN(parseInt(customWordCount)))) {
 toast.error('Please enter a valid custom word count.');
 return;
 }

 try {
 await onGenerate({
 topic: topic.trim(),
 content_type: contentType,
 tone,
 word_count: effectiveWordCount,
 custom_instructions: customInstructions || undefined,
 });
 } catch (err) {
 // Error handling is done in parent
 }
 };

 const selectTopic = (t) => {
 setTopic(t);
 setShowTopicDropdown(false);
 setTopicSearch('');
 };

 return (
 <div className="space-y-5">

 {/* ── Topic Section ── */}
 <div className="card p-5">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-7 h-7 rounded-lg bg-primary-100 
 flex items-center justify-center">
 <FiBook className="text-primary-500" size={14} />
 </div>
 <h3 className="section-title">Topic</h3>
 </div>

 {/* Mode toggle */}
 <div className="flex gap-2 mb-4">
 <button
 onClick={() => setTopicMode('select')}
 className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
 ${topicMode === 'select'
 ? 'bg-primary-500 text-white shadow-glow'
 : 'bg-slate-100 text-slate-600 '
 }`}
 >
 Select from Dataset
 </button>
 <button
 onClick={() => setTopicMode('custom')}
 className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
 ${topicMode === 'custom'
 ? 'bg-primary-500 text-white shadow-glow'
 : 'bg-slate-100 text-slate-600 '
 }`}
 >
 <FiEdit3 className="inline mr-1" size={13} />
 Custom Topic
 </button>
 </div>

 <AnimatePresence mode="wait">
 {topicMode === 'select' ? (
 <motion.div
 key="select"
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 className="space-y-3"
 >
 {/* Category filter */}
 <div className="flex gap-1.5 flex-wrap">
 {categories.slice(0, 6).map(cat => (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all
 ${selectedCategory === cat
 ? 'bg-primary-500 text-white'
 : 'bg-slate-100 text-slate-500 hover:bg-slate-200 :bg-slate-700'
 }`}
 >
 {cat}
 </button>
 ))}
 </div>

 {/* Topic search + dropdown */}
 <div className="relative">
 <div className="relative">
 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
 <input
 type="text"
 placeholder="Search topics..."
 value={topicSearch}
 onChange={e => {
 setTopicSearch(e.target.value);
 setShowTopicDropdown(true);
 }}
 onFocus={() => setShowTopicDropdown(true)}
 className="input-field pl-9 pr-4 text-sm"
 />
 {topic && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
 <span className="text-xs text-primary-500 font-medium truncate max-w-[120px]">
 ✓ {topic}
 </span>
 </div>
 )}
 </div>

 {/* Dropdown */}
 <AnimatePresence>
 {showTopicDropdown && (
 <motion.div
 initial={{ opacity: 0, y: -5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 className="absolute z-30 top-full mt-1 left-0 right-0 max-h-52 overflow-y-auto
 bg-white rounded-xl border border-slate-200 
 shadow-lg"
 onMouseLeave={() => setShowTopicDropdown(false)}
 >
 {filteredTopics.length === 0 ? (
 <p className="text-sm text-slate-400 p-4 text-center">No topics found</p>
 ) : (
 filteredTopics.slice(0, 30).map((item, i) => (
 <button
 key={i}
 onClick={() => selectTopic(item.topic)}
 className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 :bg-slate-700/50
 flex items-center gap-2.5 group transition-colors"
 >
 <span className="text-base text-slate-400"><FiBook /></span>
 <div>
 <span className="text-slate-800 group-hover:text-primary-500 transition-colors">
 {item.topic}
 </span>
 <span className="block text-xs text-slate-400">{item.category}</span>
 </div>
 </button>
 ))
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </motion.div>
 ) : (
 <motion.div
 key="custom"
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 >
 <textarea
 value={topic}
 onChange={e => setTopic(e.target.value)}
 placeholder="Enter your custom topic here... (e.g. 'Impact of AI on healthcare in developing nations')"
 rows={3}
 className="input-field resize-none text-sm"
 maxLength={500}
 />
 <div className="flex justify-between mt-1">
 <span className="text-xs text-slate-400">Be specific for better results</span>
 <span className="text-xs text-slate-400">{topic.length}/500</span>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* ── Content Type ── */}
 <div className="card p-6">
 <div className="flex items-center gap-2 mb-4">
 <h3 className="text-lg font-semibold text-slate-800 ">Content Type</h3>
 </div>

 <div className="flex flex-wrap gap-2">
 {CONTENT_TYPES.map(type => (
 <button
 key={type.value}
 onClick={() => setContentType(type.value)}
 className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border
 ${contentType === type.value
 ? 'border-primary-500 bg-primary-500 text-white shadow-glow'
 : 'border-slate-200 text-slate-700 hover:border-primary-400'
 }`}
 >
 <span className="mr-1.5">{type.icon}</span>
 {type.value}
 </button>
 ))}
 </div>
 </div>

 {/* ── Tone & Word Count ── */}
 <div className="card p-6">
 <div className="flex items-center gap-2 mb-4">
 <h3 className="text-lg font-semibold text-slate-800 ">Tone & Length</h3>
 </div>

 <div className="flex flex-col md:flex-row md:items-start gap-8">
 {/* Tone */}
 <div className="flex-1">
 <label className="block text-sm font-medium text-slate-500 mb-2">Writing Tone</label>
 <div className="flex flex-wrap gap-2">
 {TONES.map(t => (
 <button
 key={t.value}
 onClick={() => setTone(t.value)}
 className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
 ${tone === t.value
 ? 'border-primary-500 bg-primary-50 text-primary-700 '
 : 'border-slate-200 text-slate-600 hover:bg-slate-50 :bg-slate-800'
 }`}
 >
 {t.value}
 </button>
 ))}
 </div>
 </div>

 {/* Word count */}
 <div className="flex-1">
 <label className="block text-sm font-medium text-slate-500 mb-2">Word Count</label>
 <div className="relative">
 <select
 value={wordCount}
 onChange={e => setWordCount(e.target.value === 'custom' ? 'custom' : Number(e.target.value))}
 className="input-field appearance-none w-full bg-white border-slate-200 "
 >
 {WORD_COUNTS.map(wc => (
 <option key={wc.value} value={wc.value}>{wc.label} - {wc.desc}</option>
 ))}
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
 <FiChevronDown size={16} />
 </div>
 </div>

 <AnimatePresence>
 {wordCount === 'custom' && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="mt-3"
 >
 <input
 type="number"
 min={100}
 max={5000}
 placeholder="Enter custom count (e.g., 800)"
 value={customWordCount}
 onChange={e => setCustomWordCount(e.target.value)}
 className="input-field w-full text-sm"
 />
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>

 {/* ── Custom Instructions ── */}
 <div className="card p-6">
 <label className="block text-sm font-medium text-slate-500 mb-2">Additional Instructions (Optional)</label>
 <textarea
 value={customInstructions}
 onChange={e => setCustomInstructions(e.target.value)}
 placeholder="e.g. 'Focus on the Indian market', 'Include recent statistics', 'Use a conversational style'"
 rows={2}
 className="input-field resize-none text-sm w-full"
 maxLength={300}
 />
 </div>

 {/* ── Generate Button ── */}
 <motion.button
 onClick={handleGenerate}
 disabled={isLoading || !topic.trim()}
 whileTap={{ scale: 0.98 }}
 whileHover={{ scale: 1.02 }}
 className="w-full py-5 rounded-2xl text-lg font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all
 bg-gradient-to-r from-primary-600 via-violet-500 to-accent-500 bg-[length:200%_auto] animate-gradient-bg
 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
 >
 {isLoading ? (
 <>
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
 >
 <FiRefreshCw size={22} />
 </motion.div>
 Generating Content...
 </>
 ) : (
 <>
 <FiZap size={22} />
 Generate Content
 </>
 )}
 </motion.button>
 </div>
 );
}
