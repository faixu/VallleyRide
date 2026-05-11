import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { auth, onAuthStateChanged, db, doc, getDoc, handleFirestoreError, OperationType } from './firebase';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import ErrorBoundary from './components/ErrorBoundary';
import DriverApplication from './components/DriverApplication';

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Check profile in 'profiles' collection
          const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            setProfile(profileData);
            setIsAdmin(profileData.role === 'admin' || (currentUser.email === 'Flust786@gmail.com' && currentUser.emailVerified));
          } else {
            // Legacy check or new user
            const legacyDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (legacyDoc.exists()) {
              setProfile(legacyDoc.data());
              setIsAdmin(legacyDoc.data().role === 'admin' || (currentUser.email === 'Flust786@gmail.com' && currentUser.emailVerified));
            } else {
              setProfile(null);
              setIsAdmin(currentUser.email === 'Flust786@gmail.com' && currentUser.emailVerified);
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `profiles/${currentUser.uid}`);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drive" element={<DriverApplication />} />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        <Route 
          path="/dashboard" 
          element={
            user ? (
              profile ? <Dashboard user={user} profile={profile} /> : <Navigate to="/setup-profile" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/setup-profile" 
          element={
            user ? (
              profile ? <Navigate to="/dashboard" replace /> : <ProfileSetup user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/admin" 
          element={
            user ? (
              isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
