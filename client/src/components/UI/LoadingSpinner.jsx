/**
 * LoadingSpinner.jsx — AI Generation Loading Animation
 * ──────────────────────────────────────────────────────
 * Beautiful animated loading state shown while the AI generates content.
 */

import { motion } from 'framer-motion';

// Animated dots for the loading indicator
const Dot = ({ delay }) => (
 <motion.div
 className="w-2 h-2 rounded-full bg-primary-500"
 animate={{
 scale: [1, 1.4, 1],
 opacity: [0.5, 1, 0.5],
 }}
 transition={{
 duration: 1.2,
 repeat: Infinity,
 delay,
 ease: 'easeInOut',
 }}
 />
);

// Orbiting ring animation
const OrbitRing = ({ size, duration, delay, color }) => (
 <motion.div
 className="absolute inset-0 rounded-full border-2 border-transparent"
 style={{
 borderTopColor: color,
 width: size,
 height: size,
 margin: 'auto',
 top: 0, bottom: 0, left: 0, right: 0,
 }}
 animate={{ rotate: 360 }}
 transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
 />
);

export default function LoadingSpinner({ message = 'Generating content...' }) {
 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="flex flex-col items-center justify-center py-16 px-8"
 >
 {/* Orbital animation */}
 <div className="relative w-24 h-24 mb-8">
 {/* Center pulsing core */}
 <motion.div
 className="absolute inset-0 m-auto w-10 h-10 rounded-full
 bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow"
 animate={{ scale: [1, 1.15, 1] }}
 transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
 />

 {/* Orbiting rings */}
 <OrbitRing size={56} duration={1.5} delay={0} color="#6366f1" />
 <OrbitRing size={72} duration={2.5} delay={0.2} color="#06b6d4" />
 <OrbitRing size={88} duration={3.5} delay={0.4} color="#8b5cf6" />

 {/* Particle dots */}
 {[0, 60, 120, 180, 240, 300].map((angle, i) => (
 <motion.div
 key={i}
 className="absolute w-1.5 h-1.5 rounded-full bg-primary-400"
 style={{
 top: '50%',
 left: '50%',
 transformOrigin: '0 0',
 }}
 animate={{
 rotate: [angle, angle + 360],
 x: [Math.cos((angle * Math.PI) / 180) * 40, Math.cos(((angle + 360) * Math.PI) / 180) * 40],
 y: [Math.sin((angle * Math.PI) / 180) * 40, Math.sin(((angle + 360) * Math.PI) / 180) * 40],
 }}
 transition={{
 duration: 2.5,
 repeat: Infinity,
 ease: 'linear',
 delay: i * 0.1,
 }}
 />
 ))}
 </div>

 {/* Message */}
 <motion.h3
 className="text-lg font-semibold text-slate-800 mb-2"
 animate={{ opacity: [0.7, 1, 0.7] }}
 transition={{ duration: 2, repeat: Infinity }}
 >
 {message}
 </motion.h3>

 {/* Animated dots */}
 <div className="flex items-center gap-2 mb-4">
 <Dot delay={0} />
 <Dot delay={0.2} />
 <Dot delay={0.4} />
 </div>

 {/* Status messages cycling */}
 <motion.div className="text-sm text-slate-500 text-center max-w-xs">
 <AnimatedStatusMessages />
 </motion.div>
 </motion.div>
 );
}

const STATUS_MESSAGES = [
 '🔍 Analyzing your topic...',
 '✍️ Crafting the structure...',
 '🧠 Generating AI content...',
 '📝 Formatting the document...',
 '✨ Polishing the final output...',
];

function AnimatedStatusMessages() {
 return (
 <motion.div
 key="status"
 animate={{ opacity: [0, 1, 1, 0] }}
 transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
 >
 {STATUS_MESSAGES.map((msg, i) => (
 <motion.p
 key={i}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: [0, 1, 1, 0], y: [5, 0, 0, -5] }}
 transition={{
 duration: 2,
 delay: i * 2.5,
 repeat: Infinity,
 repeatDelay: STATUS_MESSAGES.length * 2.5 - 2,
 }}
 className="absolute left-0 right-0"
 >
 {msg}
 </motion.p>
 ))}
 </motion.div>
 );
}

// ─── Skeleton Loading for content area ─────────────────────────────────────────
export function ContentSkeleton() {
 return (
 <div className="space-y-4 animate-pulse p-6">
 <div className="h-7 bg-slate-200 rounded-lg w-3/4" />
 <div className="h-4 bg-slate-200 rounded w-full" />
 <div className="h-4 bg-slate-200 rounded w-5/6" />
 <div className="h-4 bg-slate-200 rounded w-4/6" />
 <div className="h-6 bg-slate-200 rounded-lg w-1/2 mt-6" />
 <div className="h-4 bg-slate-200 rounded w-full" />
 <div className="h-4 bg-slate-200 rounded w-5/6" />
 <div className="h-4 bg-slate-200 rounded w-full" />
 <div className="h-4 bg-slate-200 rounded w-3/4" />
 </div>
 );
}
