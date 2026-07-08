/**
 * PromptPreview.jsx — Prompt Preview Panel
 * ─────────────────────────────────────────
 * Shows the dynamically generated prompt before sending to the LLM.
 * Updates in real-time as the user changes options.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiCode, FiList, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PromptPreview({ preview }) {
 const [isExpanded, setIsExpanded] = useState(false);
 const [copied, setCopied] = useState(false);

 if (!preview) return null;

 const handleCopy = async () => {
 await navigator.clipboard.writeText(preview.prompt);
 setCopied(true);
 toast.success('Prompt copied!');
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="card overflow-hidden"
 >
 {/* Header */}
 <div
 className="flex items-center justify-between px-5 py-3.5 cursor-pointer
 hover:bg-slate-50 :bg-slate-800/50 transition-colors"
 onClick={() => setIsExpanded(!isExpanded)}
 >
 <div className="flex items-center gap-2.5">
 <div className="w-7 h-7 rounded-lg bg-amber-100 
 flex items-center justify-center">
 <FiCode className="text-amber-500" size={14} />
 </div>
 <div>
 <h3 className="text-sm font-semibold text-slate-800 ">
 Prompt Preview
 </h3>
 <p className="text-xs text-slate-400">
 ~{preview.estimated_tokens} tokens · {preview.sections?.length} sections
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 {/* Sections badges */}
 <span className="badge-primary hidden sm:flex">
 <FiList size={10} />
 {preview.sections?.length} sections
 </span>

 {/* Expand toggle */}
 <motion.div
 animate={{ rotate: isExpanded ? 180 : 0 }}
 transition={{ duration: 0.2 }}
 className="text-slate-400"
 >
 <FiEye size={16} />
 </motion.div>
 </div>
 </div>

 {/* Expandable content */}
 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.25 }}
 className="overflow-hidden"
 >
 <div className="border-t border-slate-200 ">
 {/* Sections list */}
 <div className="px-5 py-3 bg-slate-50 ">
 <p className="text-xs font-medium text-slate-500 mb-2">
 INCLUDED SECTIONS
 </p>
 <div className="flex flex-wrap gap-1.5">
 {preview.sections?.map((section, i) => (
 <span key={i} className="badge-accent text-xs">
 {section}
 </span>
 ))}
 </div>
 </div>

 {/* Prompt text */}
 <div className="relative">
 <div className="px-5 py-4 max-h-64 overflow-y-auto">
 <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
 {preview.prompt}
 </pre>
 </div>

 {/* Copy button */}
 <button
 onClick={handleCopy}
 className="absolute top-3 right-3 p-1.5 rounded-lg
 bg-white border border-slate-200 
 text-slate-400 hover:text-primary-500 transition-colors shadow-sm"
 title="Copy prompt"
 >
 {copied ? <FiCheck size={13} className="text-emerald-500" /> : <FiCopy size={13} />}
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 );
}
