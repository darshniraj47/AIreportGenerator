/**
 * App.jsx — Root Application Component
 * ───────────────────────────────────────
 * Wraps the app with providers and sets up routing.
 */

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard/Dashboard';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import Settings from './components/Settings/Settings';

export default function App() {
 return (
 <ThemeProvider>
 <AuthProvider>
 <BrowserRouter>
 {/* Global toast notifications */}
 <Toaster
 position="top-right"
 gutter={8}
 containerStyle={{ top: 72 }}
 toastOptions={{
 duration: 4000,
 style: {
 background: 'var(--bg-card)',
 color: 'var(--text-primary)',
 border: '1px solid var(--border-color)',
 borderRadius: '12px',
 fontSize: '14px',
 fontFamily: 'Inter, system-ui, sans-serif',
 boxShadow: 'var(--shadow-card)',
 },
 success: {
 iconTheme: { primary: '#10b981', secondary: '#fff' },
 },
 error: {
 iconTheme: { primary: '#ef4444', secondary: '#fff' },
 duration: 5000,
 },
 }}
 />

 {/* Application Routes */}
 <Routes>
 <Route path="/login" element={<Login />} />
 <Route path="/signup" element={<Signup />} />
 <Route path="/forgot-password" element={<ForgotPassword />} />
 
 {/* Protected Routes */}
 <Route 
 path="/" 
 element={
 <PrivateRoute>
 <Dashboard />
 </PrivateRoute>
 } 
 />
 <Route 
 path="/settings" 
 element={
 <PrivateRoute>
 <Settings />
 </PrivateRoute>
 } 
 />
 </Routes>
 </BrowserRouter>
 </AuthProvider>
 </ThemeProvider>
 );
}
