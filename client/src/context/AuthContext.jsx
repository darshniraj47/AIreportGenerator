import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 signOut,
 onAuthStateChanged,
 GoogleAuthProvider,
 signInWithPopup,
 sendPasswordResetEmail,
 updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
 return useContext(AuthContext);
}

// Utility to map Firebase errors to user-friendly messages
export function getAuthErrorMessage(error) {
 if (error.code === 'auth/email-already-in-use') return 'This email is already registered.';
 if (error.code === 'auth/invalid-email') return 'Invalid email address.';
 if (error.code === 'auth/invalid-credential') return 'Incorrect email or password.';
 if (error.code === 'auth/user-not-found') return 'Account not found.';
 if (error.code === 'auth/wrong-password') return 'Incorrect password.';
 if (error.code === 'auth/popup-closed-by-user') return 'Google sign-in was cancelled.';
 if (error.code === 'auth/popup-blocked') return 'Popup was blocked by your browser. Please allow popups for this site.';
 if (error.code === 'auth/network-request-failed') return 'Network error. Please try again.';
 return error.message || 'An unexpected authentication error occurred.';
}

export function AuthProvider({ children }) {
 const [currentUser, setCurrentUser] = useState(null);
 const [loading, setLoading] = useState(true);

 // Sync user profile to Firestore without blocking the UI
 const syncUserToFirestore = async (user, additionalData = {}) => {
 if (!user) return;
 try {
 const userRef = doc(db, 'users', user.uid);
 const docSnap = await getDoc(userRef);

 if (!docSnap.exists()) {
 // Create initial user document
 await setDoc(userRef, {
 uid: user.uid,
 email: user.email,
 displayName: user.displayName || additionalData.displayName || '',
 photoURL: user.photoURL || '',
 provider: user.providerData[0]?.providerId || 'email',
 createdAt: serverTimestamp(),
 preferences: {
 language: 'en',
 notifications: true,
 },
 });
 }
 } catch (error) {
 console.error("Error syncing user to Firestore (non-blocking):", error);
 }
 };

 async function signup(email, password, displayName) {
 try {
 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 // Fire and forget updating profile and syncing to Firestore
 updateProfile(userCredential.user, { displayName }).catch(console.error);
 syncUserToFirestore(userCredential.user, { displayName });
 return userCredential;
 } catch (error) {
 throw new Error(getAuthErrorMessage(error));
 }
 }

 async function login(email, password) {
 try {
 return await signInWithEmailAndPassword(auth, email, password);
 } catch (error) {
 throw new Error(getAuthErrorMessage(error));
 }
 }

 async function logout() {
 try {
 return await signOut(auth);
 } catch (error) {
 throw new Error(getAuthErrorMessage(error));
 }
 }

 async function resetPassword(email) {
 try {
 return await sendPasswordResetEmail(auth, email);
 } catch (error) {
 throw new Error(getAuthErrorMessage(error));
 }
 }

 async function signInWithGoogle() {
 try {
 const provider = new GoogleAuthProvider();
 // Configure provider to always select an account to prevent auto-login loops
 provider.setCustomParameters({ prompt: 'select_account' });
 const userCredential = await signInWithPopup(auth, provider);
 
 // Sync to Firestore in the background
 syncUserToFirestore(userCredential.user);
 return userCredential;
 } catch (error) {
 throw new Error(getAuthErrorMessage(error));
 }
 }

 useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, (user) => {
 // Only update state if the user object changes meaningfully to prevent re-renders
 setCurrentUser(prevUser => {
 if (prevUser?.uid === user?.uid) return prevUser;
 return user;
 });
 setLoading(false);
 });

 return unsubscribe;
 }, []);

 const value = {
 currentUser,
 login,
 signup,
 logout,
 resetPassword,
 signInWithGoogle,
 };

 return (
 <AuthContext.Provider value={value}>
 {!loading && children}
 </AuthContext.Provider>
 );
}
