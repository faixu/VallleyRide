import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Car, Shield, Navigation, Users, ChevronRight, X, Heart, Globe, Award, Loader2 } from 'lucide-react';
import { db, collection, onSnapshot, query, where, addDoc, handleFirestoreError, OperationType, auth } from '../firebase';
import toast from 'react-hot-toast';

interface Driver {
  uid: string;
  displayName: string;
  photoURL: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  plateNumber: string;
  distance: string;
  vehicleType: string;
  languages: string[];
  bio: string;
}

interface Review {
  customerName: string;
  comment: string;
  rating: number;
}

interface VehicleCategory {
  id: string;
  name: string;
  basePrice: string;
  icon: React.ReactNode;
  capacity: string;
  description: string;
}

const CATEGORIES: VehicleCategory[] = [
  { id: 'economy', name: 'Executive Sedan', basePrice: '₹1200', icon: <Car size={24} />, capacity: '4', description: 'Swift Dzire, Toyota Etios' },
  { id: 'premium', name: 'Premium SUV', basePrice: '₹2500', icon: <Users size={24} />, capacity: '7', description: 'Innova Crysta, Marazzo' },
  { id: 'suv', name: 'Luxury Van', basePrice: '₹4500', icon: <Shield size={24} />, capacity: '12-17', description: 'Force Tempo Traveller' },
];

const CabSelectionSkeleton = () => (
  <div className="grid gap-6 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl" />
        <div className="flex-1 space-y-4 w-full">
          <div className="h-6 bg-gray-100 rounded w-1/3 mx-auto md:mx-0" />
          <div className="h-4 bg-gray-50 rounded w-1/2 mx-auto md:mx-0" />
          <div className="flex gap-4 justify-center md:justify-start">
            <div className="h-10 bg-gray-50 rounded w-24" />
            <div className="h-10 bg-gray-50 rounded w-24" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CabSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('economy');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [driverReviews, setDriverReviews] = useState<Review[]>([]);

  useEffect(() => {
    setLoading(true);
    // Real-time query for online and available drivers
    const q = query(
      collection(db, 'profiles'),
      where('role', '==', 'driver'),
      where('status', '==', 'online'),
      where('verified', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driversData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          displayName: data.displayName || 'Anonymous Driver',
          photoURL: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
          rating: data.rating || 4.5,
          totalTrips: data.totalTrips || 0,
          vehicleModel: data.vehicleModel || 'Silver Sedan',
          plateNumber: data.plateNumber || 'JK-01-REQ',
          distance: 'Nearby', // In a real app, calculate distance from currentLocation
          vehicleType: data.vehicleType || 'economy',
          languages: data.languages || ['English', 'Hindi'],
          bio: data.bio || 'Local transportation expert in the valley.'
        } as Driver;
      });
      setDrivers(driversData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'profiles');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      const q = query(
        collection(db, 'reviews'),
        where('driverId', '==', selectedDriver.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviews = snapshot.docs.map(doc => ({
          customerName: doc.data().customerName,
          comment: doc.data().comment,
          rating: doc.data().rating
        }));
        setDriverReviews(reviews);
      });
      return () => unsubscribe();
    }
  }, [selectedDriver]);

  const filteredDrivers = drivers.filter(d => d.vehicleType === selectedCategory);

  const handleBook = async (driver: Driver) => {
    if (!auth.currentUser) {
      toast.error("Please login to book a ride");
      return;
    }

    setBookingInProgress(true);
    try {
      await addDoc(collection(db, 'rides'), {
        customerId: auth.currentUser.uid,
        driverId: driver.uid,
        driverName: driver.displayName,
        status: 'requested',
        vehicleType: driver.vehicleType,
        createdAt: new Date().toISOString(),
        pickup: { address: 'Current Location', lat: 0, lng: 0 }, // Placeholder for manual entry
        destination: { address: 'Select Destination', lat: 0, lng: 0 }
      });
      toast.success(`Booking request sent to ${driver.displayName}!`);
      window.location.href = '/dashboard/customer';
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rides');
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <section id="book-ride" className="section-padding bg-gray-50 min-h-screen">
      <div className="container-tight space-y-12">
        <div className="text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-brand-gold font-black uppercase tracking-[0.2em] text-xs"
          >
            Instant Booking
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-brand-green tracking-tight"
          >
            Choose your <span className="text-brand-gold">Comfort</span>
          </motion.h2>
        </div>

        {/* Vehicle Selection */}
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-none w-72 lg:w-full p-6 rounded-[32px] border-2 transition-all text-left group animate-float-on-hover ${
                selectedCategory === cat.id 
                  ? 'border-brand-green bg-brand-green text-white shadow-2xl shadow-brand-green/20' 
                  : 'border-white bg-white text-gray-400 hover:border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${selectedCategory === cat.id ? 'bg-white/10' : 'bg-gray-50'}`}>
                  {cat.icon}
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${selectedCategory === cat.id ? 'text-brand-gold' : 'text-brand-green'}`}>
                    {cat.basePrice}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Estimated</p>
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${selectedCategory === cat.id ? 'text-white' : 'text-brand-green'}`}>
                {cat.name}
              </h3>
              <p className="text-sm opacity-60 mb-4">{cat.description}</p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                <Users size={14} /> up to {cat.capacity} people
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedDriver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-green/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="relative p-8 pb-0 shrink-0">
                <button 
                  onClick={() => setSelectedDriver(null)}
                  className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"
                >
                  <X size={20} />
                </button>

                <div className="flex gap-8 items-start mb-8">
                  <div className="relative">
                    <img src={selectedDriver.photoURL} alt={selectedDriver.displayName} className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-white" />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-green px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
                      <Star size={12} fill="currentColor" /> {selectedDriver.rating}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-4xl font-black text-brand-green tracking-tighter mb-2">{selectedDriver.displayName}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-brand-green/5 text-brand-green px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Shield size={12} fill="currentColor" /> Background ID Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-10 no-scrollbar">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Award size={20} className="text-brand-gold mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trips</p>
                    <p className="text-lg font-black text-brand-green">{selectedDriver.totalTrips}+</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Star size={20} className="text-brand-gold mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                    <p className="text-lg font-black text-brand-green">{selectedDriver.rating}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Globe size={20} className="text-brand-gold mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Language</p>
                    <p className="text-lg font-black text-brand-green">{selectedDriver.languages[0]}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <Car size={20} className="text-brand-gold mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fleet</p>
                    <p className="text-lg font-black text-brand-green">Gold</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-brand-green flex items-center gap-2 underline decoration-brand-gold/30 underline-offset-8">
                    Biography
                  </h4>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-brand-gold/20 pl-6 text-lg">
                    "{selectedDriver.bio}"
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-brand-green flex items-center gap-2">
                    Languages Spoken
                  </h4>
                  <div className="flex gap-2">
                    {selectedDriver.languages.map(lang => (
                      <span key={lang} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-brand-green">Passenger Reviews</h4>
                  <div className="space-y-4">
                    {driverReviews.length === 0 ? (
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center py-8">New Driver - No reviews yet</p>
                    ) : (
                      driverReviews.map((rev, i) => (
                        <div key={i} className="bg-gray-50 p-6 rounded-3xl space-y-2 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-brand-gold">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} size={14} fill={rev.rating > j ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-gray-900">{rev.customerName}</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">"{rev.comment}"</p>
                          <Heart size={16} className="absolute bottom-6 right-6 text-gray-200" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 shrink-0">
                <button 
                  onClick={() => handleBook(selectedDriver)}
                  disabled={bookingInProgress}
                  className="w-full btn-secondary py-5 rounded-2xl font-black text-lg shadow-[0_20px_50px_-10px_rgba(188,157,75,0.4)] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {bookingInProgress ? <Loader2 className="animate-spin" /> : <Car size={24} />} 
                  Book with {selectedDriver.displayName.split(' ')[0]}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CabSelection;
