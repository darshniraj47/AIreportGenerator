import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword, deleteUser, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { FiUser, FiShield, FiSettings, FiTrash2, FiSave, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../UI/Navbar';
import { useNavigate, Link } from 'react-router-dom';

export default function Settings() {
 const { currentUser, logout } = useAuth();
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('profile');
 const [loading, setLoading] = useState(false);
 
 // Profile State
 const [displayName, setDisplayName] = useState('');
 const [photoURL, setPhotoURL] = useState('');

 // Security State
 const [newPassword, setNewPassword] = useState('');

 // Preferences State
 const [language, setLanguage] = useState('en');

 useEffect(() => {
 async function loadProfile() {
 if (!currentUser) return;
 
 // Optimistically set from currentUser object first for speed
 setDisplayName(currentUser.displayName || '');
 setPhotoURL(currentUser.photoURL || '');
 
 try {
 const docRef = doc(db, 'users', currentUser.uid);
 const docSnap = await getDoc(docRef);
 if (docSnap.exists()) {
 const data = docSnap.data();
 if (data.displayName) setDisplayName(data.displayName);
 if (data.photoURL) setPhotoURL(data.photoURL);
 setLanguage(data.preferences?.language || 'en');
 }
 } catch (error) {
 console.error("Error loading profile from Firestore:", error);
 }
 }
 loadProfile();
 }, [currentUser]);

 const handleSaveProfile = async () => {
 if (loading) return;
 try {
 setLoading(true);
 // Optimistic UI: toast instantly, save in background
 toast.success('Profile updated successfully!');
 
 const promises = [];
 if (currentUser) {
 promises.push(updateProfile(currentUser, { displayName, photoURL }));
 }
 const docRef = doc(db, 'users', currentUser.uid);
 promises.push(setDoc(docRef, { displayName, photoURL }, { merge: true }));
 
 await Promise.all(promises);
 } catch (error) {
 toast.error('Failed to update profile: ' + error.message);
 } finally {
 setLoading(false);
 }
 };

 const handleSavePreferences = async () => {
 if (loading) return;
 try {
 setLoading(true);
 toast.success('Preferences saved!');
 
 const docRef = doc(db, 'users', currentUser.uid);
 await setDoc(docRef, { preferences: { language, notifications: true } }, { merge: true });
 } catch (error) {
 toast.error('Failed to save preferences: ' + error.message);
 } finally {
 setLoading(false);
 }
 };

 const handleChangePassword = async (e) => {
 e.preventDefault();
 if (loading) return;
 try {
 setLoading(true);
 await updatePassword(currentUser, newPassword);
 setNewPassword('');
 toast.success('Password updated successfully!');
 } catch (error) {
 toast.error(error.message || 'Failed to update password. You may need to log in again.');
 } finally {
 setLoading(false);
 }
 };

 const handleDeleteAccount = async () => {
 if (loading) return;
 const confirm = window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.');
 if (!confirm) return;
 
 try {
 setLoading(true);
 await deleteUser(currentUser);
 toast.success('Account deleted.');
 navigate('/login');
 } catch (error) {
 toast.error('Failed to delete account. You may need to log in again.');
 setLoading(false);
 }
 };

 const handleLogout = async () => {
 try {
 await logout();
 navigate('/login');
 } catch (error) {
 toast.error('Failed to log out: ' + error.message);
 }
 };

 return (
 <div className="min-h-screen bg-slate-50">
 <Navbar onHistoryToggle={() => {}} hideHistory={true} />
 
 <main className="max-w-5xl mx-auto px-4 py-24">
 <div className="mb-8">
 <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-4 transition-colors">
 <span className="mr-2">&larr;</span> Back to Dashboard
 </Link>
 <h1 className="text-3xl font-bold font-heading text-slate-900">Account Settings</h1>
 <p className="text-slate-500 mt-2">Manage your profile, security, and preferences.</p>
 </div>

 <div className="flex flex-col md:flex-row gap-8">
 {/* Sidebar Tabs */}
 <div className="w-full md:w-64 space-y-2">
 <TabButton icon={FiUser} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
 <TabButton icon={FiShield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
 <TabButton icon={FiSettings} label="Preferences" active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} />
 <div className="border-t border-slate-200 my-4"></div>
 <TabButton icon={FiLogOut} label="Log Out" active={false} onClick={handleLogout} />
 </div>

 {/* Tab Content */}
 <div className="flex-1">
 <motion.div
 key={activeTab}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 className="card p-8 bg-white shadow-xl rounded-2xl border border-slate-100"
 >
 {activeTab === 'profile' && (
 <div className="space-y-6">
 <h2 className="text-xl font-bold text-slate-900 mb-4">Profile Information</h2>
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
 <input type="text" disabled value={currentUser?.email || ''} className="input-field w-full bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200 rounded-xl" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
 <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input-field w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-xl" />
 </div>
 <button onClick={handleSaveProfile} disabled={loading} className="btn-primary flex items-center py-2 px-6 rounded-xl shadow-sm hover:shadow-md transition-all">
 <FiSave className="mr-2" /> Save Profile
 </button>
 </div>
 )}

 {activeTab === 'security' && (
 <div className="space-y-6">
 <h2 className="text-xl font-bold text-slate-900 mb-4">Security Settings</h2>
 <form onSubmit={handleChangePassword} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
 <input 
 type="password" 
 required 
 minLength={6}
 value={newPassword} 
 onChange={(e) => setNewPassword(e.target.value)} 
 className="input-field w-full max-w-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-xl" 
 />
 </div>
 <button type="submit" disabled={loading} className="btn-primary py-2 px-6 rounded-xl shadow-sm hover:shadow-md transition-all">
 Update Password
 </button>
 </form>
 
 <div className="pt-6 border-t border-slate-200 mt-8">
 <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
 <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all associated data.</p>
 <button onClick={handleDeleteAccount} disabled={loading} className="py-2 px-6 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center shadow-sm">
 <FiTrash2 className="inline mr-2" /> Delete Account
 </button>
 </div>
 </div>
 )}

 {activeTab === 'preferences' && (
 <div className="space-y-6">
 <h2 className="text-xl font-bold text-slate-900 mb-4">App Preferences</h2>
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
 <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field w-full max-w-xs bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 rounded-xl">
 <option value="en">English (US)</option>
 <option value="es">Spanish</option>
 <option value="fr">French</option>
 </select>
 </div>
 <button onClick={handleSavePreferences} disabled={loading} className="btn-primary flex items-center py-2 px-6 rounded-xl shadow-sm hover:shadow-md transition-all">
 <FiSave className="mr-2" /> Save Preferences
 </button>
 </div>
 )}
 </motion.div>
 </div>
 </div>
 </main>
 </div>
 );
}

function TabButton({ icon: Icon, label, active, onClick }) {
 return (
 <button
 onClick={onClick}
 className={`w-full flex items-center p-3 rounded-xl transition-all font-medium ${
 active 
 ? 'bg-primary-50 text-primary-600' 
 : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
 }`}
 >
 <Icon className="mr-3" size={20} />
 {label}
 </button>
 );
}
