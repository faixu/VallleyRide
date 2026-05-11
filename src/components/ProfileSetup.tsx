import React, { useState } from 'react';
import { User, Car, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { db, setDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import toast from 'react-hot-toast';

interface ProfileSetupProps {
  user: any;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const selectRole = async (role: 'customer' | 'driver') => {
    setLoading(true);
    const path = `profiles/${user.uid}`;
    try {
      await setDoc(doc(db, 'profiles', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: role,
        status: 'active',
        createdAt: new Date().toISOString(),
        verified: role === 'customer' // Customers are pre-verified, drivers need verification
      });
      toast.success(`Welcome to Valley Ride! Profile setup as ${role}.`);
      window.location.reload(); // Refresh to catch profile state in App.tsx
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">How would you like to use Valley Ride?</h1>
          <p className="text-gray-600">Choose your account type to get started with the valley's premium transport network.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Option */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-brand-gold transition-all cursor-pointer group flex flex-col items-center text-center"
            onClick={() => !loading && selectRole('customer')}
          >
            <div className="w-20 h-20 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User size={40} className="text-brand-gold" />
            </div>
            <h2 className="text-2xl font-bold text-brand-green mb-3">Book a Ride</h2>
            <p className="text-gray-500 mb-8">I want to travel comfortably around Kashmir with verified local drivers.</p>
            <div className="mt-auto flex items-center gap-2 font-bold text-brand-gold">
              Get Started <ArrowRight size={18} />
            </div>
          </motion.div>

          {/* Driver Option */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-brand-green p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-brand-gold transition-all cursor-pointer group flex flex-col items-center text-center text-white"
            onClick={() => !loading && selectRole('driver')}
          >
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Car size={40} className="text-brand-gold" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Become a Driver</h2>
            <p className="text-white/60 mb-8">I want to provide transport services and earn as a verified local partner.</p>
            <div className="mt-auto flex items-center gap-2 font-bold text-brand-gold">
              Join the Network <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2"><Shield size={16} /> Secure Registration</div>
          <div className="flex items-center gap-2">Verified Profiles</div>
          <div className="flex items-center gap-2">24/7 Support</div>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileSetup;
