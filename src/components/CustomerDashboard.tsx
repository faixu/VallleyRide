import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Clock, Star, Car, Shield, Send, User, MessageCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { db, collection, addDoc, onSnapshot, query, where, orderBy, handleFirestoreError, OperationType, limit, getDocs } from '../firebase';
import toast from 'react-hot-toast';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface CustomerDashboardProps {
  user: any;
  profile: any;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, profile }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [activeRide, setActiveRide] = useState<any>(null);
  const [completedRides, setCompletedRides] = useState<any[]>([]);
  const [vehicleType, setVehicleType] = useState<'economy' | 'premium' | 'suv'>('economy');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; rideId: string; driverId: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    // Listen for customer's active ride
    const q = query(
      collection(db, 'rides'),
      where('customerId', '==', user.uid),
      where('status', 'in', ['requested', 'accepted', 'arrived', 'started']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeActive = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveRide({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveRide(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'rides');
    });

    // Listen for completed rides (last 10)
    const qCompleted = query(
      collection(db, 'rides'),
      where('customerId', '==', user.uid),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc'),
      limit(10)
    );

    const unsubscribeCompleted = onSnapshot(qCompleted, async (snapshot) => {
      const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // For each completed ride, check if it already has a review
      const ridesWithReviewStatus = await Promise.all(rides.map(async (ride) => {
        const reviewQuery = query(
          collection(db, 'reviews'),
          where('rideId', '==', ride.id),
          limit(1)
        );
        const reviewSnap = await getDocs(reviewQuery);
        return { ...ride, reviewed: !reviewSnap.empty };
      }));

      setCompletedRides(ridesWithReviewStatus);
    }, (error) => {
      console.error("Fetch completed rides error:", error);
    });

    return () => {
      unsubscribeActive();
      unsubscribeCompleted();
    };
  }, [user.uid]);

  const requestRide = async () => {
    if (!pickup || !destination) {
      toast.error("Please enter pickup and destination");
      return;
    }

    setBookingLoading(true);
    try {
      const rideData = {
        customerId: user.uid,
        customerName: profile.displayName,
        customerPhone: profile.phone || '',
        pickup: { address: pickup },
        destination: { address: destination },
        vehicleType,
        status: 'requested',
        estimatedFare: vehicleType === 'economy' ? 1200 : vehicleType === 'premium' ? 2200 : 3500,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'rides'), rideData);
      toast.success("Ride requested! Searching for nearby drivers...");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rides');
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async () => {
    if (!reviewModal || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        rideId: reviewModal.rideId,
        driverId: reviewModal.driverId,
        customerId: user.uid,
        customerName: profile.displayName,
        rating,
        comment,
        createdAt: new Date().toISOString()
      });
      toast.success("Thank you for your feedback!");
      setReviewModal(null);
      setRating(0);
      setComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)] overflow-hidden">
      {/* Sidebar - Controls */}
      <div className="w-full lg:w-[400px] bg-white shadow-xl z-10 p-6 overflow-y-auto border-r border-gray-100">
        <AnimatePresence mode="wait">
          {!activeRide ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-brand-green tracking-tight">Need a Ride?</h2>
                <p className="text-sm text-gray-500">Enter your pickup and destination in the Kashmir valley.</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                  <input 
                    type="text" 
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-gray-50 p-4 pl-10 rounded-2xl border-2 border-transparent focus:border-brand-gold outline-none transition-all font-medium"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100" />
                  <input 
                    type="text" 
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-gray-50 p-4 pl-10 rounded-2xl border-2 border-transparent focus:border-brand-gold outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Vehicle Type</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'economy', label: 'Economy', icon: <Car size={20} />, price: '₹' },
                    { id: 'premium', label: 'Premium', icon: <Navigation size={20} />, price: '₹₹' },
                    { id: 'suv', label: 'SUV', icon: <MapPin size={20} />, price: '₹₹₹' },
                  ].map((type) => (
                    <button 
                      key={type.id}
                      onClick={() => setVehicleType(type.id as any)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${vehicleType === type.id ? 'border-brand-gold bg-brand-gold/5 text-brand-green shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      {type.icon}
                      <span className="text-xs font-bold">{type.label}</span>
                      <span className="text-[10px] opacity-70">{type.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={requestRide}
                disabled={bookingLoading}
                className="w-full btn-secondary py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-gold/20 disabled:opacity-50"
              >
                {bookingLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>Request Valley Ride <Send size={20} /></>
                )}
              </button>

              {/* Ride History / Pending Reviews */}
              {completedRides.length > 0 && (
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={16} className="text-brand-gold" /> Recent Rides
                  </h3>
                  <div className="space-y-3">
                    {completedRides.map(ride => (
                      <div key={ride.id} className="p-4 bg-gray-50 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-gray-900 truncate pr-2">{ride.destination.address}</p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(ride.completedAt).toLocaleDateString()}</span>
                        </div>
                        {!ride.reviewed && (
                          <button 
                            onClick={() => setReviewModal({ isOpen: true, rideId: ride.id, driverId: ride.driverId })}
                            className="w-full py-2 bg-brand-gold/10 text-brand-gold rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-brand-gold/20 transition-all"
                          >
                            <Star size={12} fill="currentColor" /> Rate Driver
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-800">
                <Shield size={20} className="shrink-0" />
                <p className="text-xs leading-relaxed font-medium">All rides are tracked in real-time for your safety. Our drivers are verified local residents of the Valley.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-wider">Active Ride Tracking</span>
                <span className="text-xs text-gray-400 font-medium">#{activeRide.id.slice(0, 8)}</span>
              </div>

              <div className="flex flex-col items-center text-center py-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-xl">
                  {activeRide.status === 'requested' ? (
                     <div className="animate-pulse flex items-center justify-center w-full h-full bg-brand-gold/10">
                        <Navigation className="text-brand-gold" size={32} />
                     </div>
                  ) : (
                    <Car className="text-brand-green" size={32} />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-brand-green capitalize">
                  {activeRide.status === 'requested' ? 'Searching for Driver' : activeRide.status.replace('_', ' ')}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {activeRide.status === 'requested' ? 'Wait while we connect you to a nearby partner' : 'Driver is on the way to your location'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-0.5 h-8 bg-gray-300 border-dashed border-l" />
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Pickup</p>
                      <p className="text-sm font-bold text-gray-700">{activeRide.pickup.address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Drop-off</p>
                      <p className="text-sm font-bold text-gray-700">{activeRide.destination.address}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Fare</p>
                    <p className="text-xl font-bold text-brand-green">₹{activeRide.estimatedFare}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold text-gray-700 capitalize">{activeRide.vehicleType}</p>
                  </div>
                </div>
              </div>

              {activeRide.driverId && (
                <div className="space-y-3">
                  <div className="p-4 border-2 border-brand-green/10 rounded-2xl flex items-center gap-4 bg-brand-green/5">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <User size={24} className="text-brand-green" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold tracking-tight">Driver Assigned</p>
                        <p className="text-lg font-bold text-brand-green">{activeRide.driverName || 'Verified Partner'}</p>
                    </div>
                  </div>
                  
                  {activeRide.driverPhone && (
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href={`tel:${activeRide.driverPhone}`}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-brand-green/20 text-brand-green rounded-xl font-bold text-sm hover:bg-brand-green hover:text-white transition-all shadow-sm"
                      >
                        <Phone size={16} /> Call Driver
                      </a>
                      <a 
                        href={`sms:${activeRide.driverPhone}`}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-brand-green/20 text-brand-green rounded-xl font-bold text-sm hover:bg-brand-green hover:text-white transition-all shadow-sm"
                      >
                        <MessageCircle size={16} /> Message
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => toast.success("Feature coming soon! Direct call enabled below.")}
                className="w-full p-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                Cancel Ride Request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map View */}
      <div className="flex-1 relative bg-gray-200">
        {API_KEY ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: 34.0837, lng: 74.7973 }} // Srinagar
              defaultZoom={13}
              mapId="RIDE_SHARE_MAP"
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              style={{ width: '100%', height: '100%' }}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
               {/* Future: Add markers for driver locations and routes */}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1540321200212-0749e7769991?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
            <div className="absolute inset-0 bg-brand-green/20 backdrop-blur-[2px]" />
            <div className="relative z-10 bg-white/90 p-8 rounded-3xl shadow-2xl border border-white max-w-sm text-center">
              <MapPin size={40} className="text-brand-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Tracking Offline</h3>
              <p className="text-sm text-gray-600 font-medium">Map services are currently in maintenance mode. You can still request rides via the sidebar or by calling our support line.</p>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-green/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-brand-gold" fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-brand-green">Rate Your Ride</h3>
                <p className="text-sm text-gray-500 mt-1">How was your experience with our partner driver?</p>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className={`p-1 transition-all ${rating >= s ? 'text-brand-gold' : 'text-gray-200'} hover:scale-110`}
                  >
                    <Star size={36} fill={rating >= s ? "currentColor" : "none"} strokeWidth={2.5} />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Tell us more (Optional)</p>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the trip, vehicle, or driver..."
                  className="w-full bg-gray-50 p-4 rounded-xl border-2 border-transparent focus:border-brand-gold outline-none transition-all text-sm h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setReviewModal(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  Skip
                </button>
                <button 
                  onClick={submitReview}
                  disabled={submittingReview || rating === 0}
                  className="flex-1 btn-secondary py-4 rounded-xl font-bold text-sm shadow-lg shadow-brand-gold/20 disabled:opacity-50"
                >
                  {submittingReview ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div> : 'Submit feedback'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;
