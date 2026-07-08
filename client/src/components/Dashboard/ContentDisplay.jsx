/**
 * ContentDisplay.jsx — AI Generated Content Display
 * ───────────────────────────────────────────────────
 * Displays formatted AI content with edit mode, copy, PDF, and DOCX export.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiCopy, FiCheck, FiDownload, FiEdit3, FiEye,
 FiRefreshCw, FiClock, FiFileText, FiSave, FiX
} from 'react-icons/fi';
import { downloadAsPDF, downloadAsDOCX, copyToClipboard } from '../../utils/exportHelpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ContentDisplay({ result, isLoading, onRegenerate, onClose }) {
 const [copied, setCopied] = useState(false);
 const [isEditing, setIsEditing] = useState(false);
 const [editedContent, setEditedContent] = useState('');
 const [isExporting, setIsExporting] = useState(false);
 const textareaRef = useRef(null);

 if (isLoading) {
 return (
 <div className="card min-h-[600px] flex items-center justify-center">
 <LoadingSpinner message="AI is generating your content..." />
 </div>
 );
 }

 if (!result) {
 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="card min-h-[600px] flex flex-col items-center justify-center p-12 text-center mt-4"
 >
 {/* Decorative graphic */}
 <div className="relative mb-8">
 <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100
 
 flex items-center justify-center shadow-lg">
 <FiFileText size={40} className="text-primary-500" />
 </div>
 <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-500
 flex items-center justify-center shadow-md">
 <span className="text-white text-xs font-bold">AI</span>
 </div>
 </div>

 <h3 className="text-3xl font-bold text-slate-800 mb-4">
 Content Generator
 </h3>
 <p className="text-slate-500 max-w-md text-base leading-relaxed">
 Select a topic, choose your content type and settings on the left,
 then click <strong>Generate</strong> to create AI-powered content.
 </p>

 {/* Feature chips */}
 <div className="flex flex-wrap gap-2 mt-6 justify-center">
 {['Reports', 'Blogs', 'Emails', 'Assignments', 'Articles'].map(f => (
 <span key={f} className="badge-primary text-xs">{f}</span>
 ))}
 </div>
 </motion.div>
 );
 }

 const displayContent = isEditing ? editedContent : result.content;

 const handleCopy = async () => {
 const success = await copyToClipboard(displayContent);
 if (success) {
 setCopied(true);
 toast.success('Content copied to clipboard!');
 setTimeout(() => setCopied(false), 2000);
 } else {
 toast.error('Failed to copy. Please try manually.');
 }
 };

 const handlePDF = async () => {
 setIsExporting(true);
 try {
 downloadAsPDF(displayContent, result.topic, result.content_type, result.tone);
 toast.success('PDF downloaded successfully!');
 } catch (err) {
 toast.error('Failed to generate PDF.');
 } finally {
 setIsExporting(false);
 }
 };

 const handleDOCX = async () => {
 setIsExporting(true);
 try {
 await downloadAsDOCX(displayContent, result.topic, result.content_type, result.tone);
 toast.success('DOCX downloaded successfully!');
 } catch (err) {
 toast.error('Failed to generate DOCX.');
 } finally {
 setIsExporting(false);
 }
 };

 const startEditing = () => {
 setEditedContent(result.content);
 setIsEditing(true);
 };

 const saveEdits = () => {
 result.content = editedContent;
 setIsEditing(false);
 toast.success('Changes saved!');
 };

 const cancelEdits = () => {
 setEditedContent('');
 setIsEditing(false);
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
 >
 {/* ── Action Bar (Minimal Toolbar) ── */}
 <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
 <div className="flex items-center gap-3">
 <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider">
 {result.content_type}
 </span>
 <span className="text-sm font-medium text-slate-500 ">
 ~ {result.word_count?.toLocaleString()} words
 </span>
 </div>

 <div className="flex items-center gap-2">
 {/* Edit toggle */}
 {!isEditing ? (
 <button onClick={startEditing} className="p-2 text-black hover:bg-slate-100 :bg-slate-800 rounded-lg transition-colors tooltip" title="Edit">
 <FiEdit3 size={18} strokeWidth={2.5} />
 </button>
 ) : (
 <>
 <button onClick={saveEdits} className="p-2 text-emerald-600 hover:bg-emerald-50 :bg-emerald-900/20 rounded-lg transition-colors" title="Save">
 <FiSave size={18} strokeWidth={2.5} />
 </button>
 <button onClick={cancelEdits} className="p-2 text-red-600 hover:bg-red-50 :bg-red-900/20 rounded-lg transition-colors" title="Cancel">
 <FiX size={18} strokeWidth={2.5} />
 </button>
 </>
 )}

 <div className="w-px h-5 bg-slate-200 mx-1" />

 {/* Actions */}
 <button onClick={handleCopy} className="p-2 text-black hover:bg-primary-50 :bg-primary-900/20 rounded-lg transition-colors" title="Copy">
 {copied ? <FiCheck size={18} strokeWidth={2.5} className="text-emerald-500" /> : <FiCopy size={18} strokeWidth={2.5} />}
 </button>
 
 <button onClick={handlePDF} disabled={isExporting} className="p-2 text-black hover:bg-red-50 :bg-red-900/20 rounded-lg transition-colors" title="Download PDF">
 <FiDownload size={18} strokeWidth={2.5} />
 </button>

 <button onClick={handleDOCX} disabled={isExporting} className="p-2 text-black hover:bg-blue-50 :bg-blue-900/20 rounded-lg transition-colors" title="Download DOCX">
 <FiFileText size={18} strokeWidth={2.5} />
 </button>

 {onRegenerate && (
 <button onClick={onRegenerate} className="p-2 text-black hover:bg-accent-50 :bg-accent-900/20 rounded-lg transition-colors" title="Regenerate">
 <FiRefreshCw size={18} strokeWidth={2.5} />
 </button>
 )}

 {onClose && (
 <>
 <div className="w-px h-5 bg-slate-200 mx-1" />
 <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-red-500 rounded-lg transition-all" title="Close Panel">
 <FiX size={20} strokeWidth={3} />
 </button>
 </>
 )}
 </div>
 </div>

 {/* ── Content Body ── */}
 <div className="px-8 py-10 max-w-3xl mx-auto">
 <AnimatePresence mode="wait">
 {isEditing ? (
 <motion.div
 key="editor"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 >
 <div className="mb-2 flex items-center gap-2">
 <FiEdit3 size={14} className="text-primary-500" />
 <span className="text-xs font-medium text-primary-500">Edit Mode — Markdown supported</span>
 </div>
 <textarea
 ref={textareaRef}
 value={editedContent}
 onChange={e => setEditedContent(e.target.value)}
 className="w-full min-h-[500px] p-4 rounded-xl border border-primary-300 
 bg-white text-slate-800 
 font-mono text-sm leading-relaxed resize-y
 focus:outline-none focus:ring-2 focus:ring-primary-500"
 />
 <div className="flex justify-between mt-2 text-xs text-slate-400">
 <span>Markdown supported</span>
 <span>{editedContent.split(' ').filter(Boolean).length} words</span>
 </div>
 </motion.div>
 ) : (
 <motion.div
 key="preview"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="markdown-content"
 >
 <ReactMarkdown remarkPlugins={[remarkGfm]}>
 {displayContent}
 </ReactMarkdown>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* ── Footer ── */}
 <div className="px-6 py-3 border-t border-slate-200 
 bg-slate-50 flex items-center justify-between">
 <span className="text-xs text-slate-400">
 Generated with AI
 </span>
 {result.history_id && (
 <span className="text-xs text-emerald-500 flex items-center gap-1">
 <FiCheck size={11} />
 Saved to history
 </span>
 )}
 </div>
 </motion.div>
 );
}
