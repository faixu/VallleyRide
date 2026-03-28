import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { LogIn, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Welcome back, Admin!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-gray-100">
        <div className="bg-brand-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-brand-green" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-brand-green mb-2 tracking-tighter">VALLEY<span className="text-brand-gold">ADMIN</span></h1>
        <p className="text-gray-500 mb-10">Secure access for Valley Ride management only.</p>
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-brand-green text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <>
              <LogIn size={20} />
              Sign in with Google
            </>
          )}
        </button>
        
        <p className="mt-8 text-xs text-gray-400">
          By signing in, you agree to the administrative terms of service.
        </p>
      </div>
    </div>
  );
};

export default Login;
