import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import toast from 'react-hot-toast';

const DriverApplication = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    vehicleModel: '',
    licenseDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicationsPath = 'driver_applications';
      await addDoc(collection(db, applicationsPath), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'driver_applications');
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-brand-green">Application Received!</h2>
          <p className="text-gray-600 leading-relaxed">
            Thank you for your interest in joining <span className="font-bold">Valley Ride</span>. 
            Our team will review your details and contact you within 24-48 hours.
          </p>
          <Link 
            to="/" 
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-green p-2 rounded-lg">
              <Car className="text-brand-gold" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-brand-green">
              VALLEY<span className="text-brand-gold">RIDE</span>
            </span>
          </Link>
          <Link to="/" className="text-brand-green font-bold flex items-center gap-1 hover:text-brand-gold transition-colors">
            <ArrowLeft size={18} /> Exit
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Column - Info */}
          <div className="bg-brand-green p-10 text-white flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 tracking-tighter">Drive with Us</h1>
              <p className="text-white/70 text-lg">
                Join Kashmir's most trusted travel network and start earning on your own schedule.
              </p>
            </div>

            <div className="space-y-6 text-white/80">
              <div className="flex gap-4 items-start">
                <div className="bg-white/10 p-2 rounded-lg"><CheckCircle2 className="text-brand-gold" size={20} /></div>
                <div>
                  <p className="font-bold text-white">Flexible Hours</p>
                  <p className="text-sm">Work when you want, where you want.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-white/10 p-2 rounded-lg"><CheckCircle2 className="text-brand-gold" size={20} /></div>
                <div>
                  <p className="font-bold text-white">Steady Income</p>
                  <p className="text-sm">Regular bookings for airport & sightseeing.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-white/10 p-2 rounded-lg"><CheckCircle2 className="text-brand-gold" size={20} /></div>
                <div>
                  <p className="font-bold text-white">Professional Support</p>
                  <p className="text-sm">24/7 assistance for our driver partners.</p>
                </div>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop" 
              alt="Driving" 
              className="rounded-2xl opacity-50 contrast-125 mix-blend-overlay"
            />
          </div>

          {/* Right Column - Form */}
          <div className="p-10 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input 
                  required
                  type="tel" 
                  placeholder="+91 00000 00000"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green transition-all"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Car size={16} /> Vehicle Model
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Toyota Innova, Swift Dzire"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green transition-all"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} /> License Details
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="License number and state of issue"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green transition-all"
                  value={formData.licenseDetails}
                  onChange={(e) => setFormData({...formData, licenseDetails: e.target.value})}
                />
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
              </button>
              <p className="text-center text-xs text-gray-400">
                By submitting, you agree to our Terms of Service & Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>© 2024 Valley Ride Kashmir. Join our mission to provide the best travel experience.</p>
        </div>
      </footer>
    </div>
  );
};

export default DriverApplication;
