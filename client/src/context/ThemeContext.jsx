/**
 * ThemeContext.jsx
 * ─────────────────
 * Simplified ThemeContext that enforces a strict light (white) theme
 * as requested. Dark mode has been permanently removed.
 */

import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
 useEffect(() => {
 // Ensure 'dark' class is permanently removed from the document
 document.documentElement.classList.remove('dark');
 }, []);

 // Provide a stubbed context so any lingering components that call useTheme don't break
 const value = {
 isDark: false,
 setIsDark: () => {},
 toggleTheme: () => {}
 };

 return (
 <ThemeContext.Provider value={value}>
 {children}
 </ThemeContext.Provider>
 );
}

export function useTheme() {
 const context = useContext(ThemeContext);
 if (!context) {
 throw new Error('useTheme must be used within a ThemeProvider');
 }
 return context;
}
