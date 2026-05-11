import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Shield, CheckCircle, XCircle, Power, User, Phone, Play, Flag, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot, query, where, updateDoc, doc, db as firestore, handleFirestoreError, OperationType } from '../firebase';
import toast from 'react-hot-toast';

interface DriverDashboardProps {
  user: any;
  profile: any;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, profile }) => {
  const [online, setOnline] = useState(profile.status === 'online');
  const [requests, setRequests] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);

  useEffect(() => {
    // Update online status in Firestore
    const updateStatus = async () => {
      try {
        await updateDoc(doc(db, 'profiles', user.uid), {
          status: online ? 'online' : 'offline',
          // If going online and no active ride, set as available
          isAvailable: online ? (!activeRide) : false
        });
      } catch (error) {
        console.error("Status update error:", error);
      }
    };
    updateStatus();
  }, [online, user.uid]);

  useEffect(() => {
    // Listen for new ride requests if online, available, and no active ride
    if (online && profile.isAvailable !== false && !activeRide) {
      const q = query(
        collection(db, 'rides'),
        where('status', '==', 'requested'),
        where('vehicleType', '==', profile.vehicleType || 'economy') // Simple matching
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(reqs);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'rides');
      });

      return () => unsubscribe();
    } else {
      setRequests([]);
    }
  }, [online, activeRide, profile.vehicleType]);

  useEffect(() => {
    // Listen for active ride assigned to this driver
    const q = query(
      collection(db, 'rides'),
      where('driverId', '==', user.uid),
      where('status', 'in', ['accepted', 'arrived', 'started'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setActiveRide({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveRide(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'activeRides');
    });

    return () => unsubscribe();
  }, [user.uid]);

  const acceptRide = async (rideId: string) => {
    try {
      await updateDoc(doc(db, 'rides', rideId), {
        status: 'accepted',
        driverId: user.uid,
        driverName: profile.displayName || 'Verified Driver',
        driverPhone: profile.phone || profile.phoneNumber || '',
        acceptedAt: new Date().toISOString()
      });
      // Also mark driver as Busy/Engaged
      await updateDoc(doc(db, 'profiles', user.uid), {
        isAvailable: false
      });
      toast.success("Ride accepted! Head to the pickup location.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `rides/${rideId}`);
    }
  };

  const updateRideStatus = async (status: 'arrived' | 'started' | 'completed') => {
    if (!activeRide) return;
    try {
      const updates: any = { status };
      if (status === 'started') updates.startedAt = new Date().toISOString();
      if (status === 'completed') updates.completedAt = new Date().toISOString();

      await updateDoc(doc(db, 'rides', activeRide.id), updates);
      
      if (status === 'completed') {
          // Mark driver as Available again
          await updateDoc(doc(db, 'profiles', user.uid), {
            isAvailable: true
          });
          toast.success("Ride completed! Great job.");
          setActiveRide(null);
      } else {
          toast.success(`Status updated to ${status}`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `rides/${activeRide.id}`);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Driver Controls */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 border border-gray-100">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 bg-brand-green/5 rounded-2xl flex items-center justify-center text-brand-green">
             <Car size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Center</h2>
              {profile.verified ? (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase">
                  <CheckCircle size={12} fill="currentColor" className="text-white bg-green-500 rounded-full" /> Verified
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase">
                  <XCircle size={12} fill="currentColor" className="text-white bg-red-500 rounded-full" /> Pending
                </div>
              )}
            </div>
            <p className="text-gray-500 font-medium">{online ? 'You are visible to customers' : 'You are currently offline'}</p>
          </div>
        </div>

        <button 
          onClick={() => setOnline(!online)}
          className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg ${online ? 'bg-red-50 text-red-600 shadow-red-100 hover:bg-red-100' : 'bg-brand-green text-white shadow-brand-green/20 hover:opacity-90'}`}
        >
          <Power size={24} /> {online ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="grid md:grid-cols-1 gap-10">
        <AnimatePresence mode="wait">
          {!activeRide ? (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-6"
            >
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold text-brand-green tracking-tight">Nearby Requests</h3>
                 <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest leading-none flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" /> Live Now
                 </span>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
                  <Navigation size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No pending requests in your area.</p>
                  <p className="text-xs text-gray-300 mt-1">Requests matching your vehicle type will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {requests.map(req => (
                    <motion.div 
                      key={req.id}
                      layoutId={req.id}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between gap-6 overflow-hidden relative group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
                      <div className="space-y-4 flex-1">
                        <div className="flex gap-4">
                           <div className="flex flex-col items-center gap-1 mt-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <div className="w-0.5 h-6 bg-gray-200 border-dashed border-l" />
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                           </div>
                           <div className="flex-1">
                              <div className="mb-3">
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                                 <p className="text-md font-bold text-brand-green">{req.pickup.address}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                                 <p className="text-md font-bold text-gray-700">{req.destination.address}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-8 border-t border-gray-50 pt-4">
                           <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Fare</p>
                              <p className="text-xl font-bold text-brand-green tracking-tight">₹{req.estimatedFare}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</p>
                              <p className="text-sm font-bold text-gray-700">{req.customerName}</p>
                           </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-center gap-3 md:w-48">
                        <button 
                          onClick={() => acceptRide(req.id)}
                          className="flex-1 btn-secondary py-4 rounded-xl font-bold shadow-lg shadow-brand-gold/20"
                        >
                          Accept Ride
                        </button>
                        <button className="flex-1 px-6 py-4 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100">
                          Decline
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="space-y-6"
            >
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-brand-green tracking-tight">Active Assignment</h3>
                  <div className="px-4 py-2 bg-brand-gold text-brand-green rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-gold/10">
                     <Clock size={14} /> LIVE TRIP
                  </div>
               </div>

               <div className="bg-white rounded-3xl shadow-2xl border border-brand-green/20 overflow-hidden">
                  <div className="bg-brand-green p-8 text-white">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1 font-mono">Trip ID: {activeRide.id.slice(0, 8)}</p>
                           <h4 className="text-3xl font-bold">{activeRide.customerName}</h4>
                           <div className="flex items-center gap-4 mt-2">
                              <a href={`tel:${activeRide.customerPhone}`} className="flex items-center gap-2 text-brand-gold font-bold bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition-all">
                                 <Phone size={14} /> Call
                              </a>
                              <div className="flex items-center gap-1 text-brand-gold">
                                 <Star size={14} fill="currentColor" /> <span className="font-bold">4.8</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Fare Amount</p>
                           <p className="text-4xl font-bold tracking-tighter">₹{activeRide.estimatedFare}</p>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div className="flex gap-4">
                           <div className="bg-white/10 p-3 rounded-xl h-fit"><MapPin size={24} /></div>
                           <div>
                              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">From</p>
                              <p className="font-bold">{activeRide.pickup.address}</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="bg-brand-gold/20 p-3 rounded-xl h-fit"><Flag size={24} className="text-brand-gold" /></div>
                           <div>
                              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">To</p>
                              <p className="font-bold">{activeRide.destination.address}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 space-y-6">
                     <div className="flex gap-4">
                        {activeRide.status === 'accepted' && (
                          <button 
                            onClick={() => updateRideStatus('arrived')}
                            className="flex-1 flex items-center justify-center gap-3 bg-brand-green text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-green/20 hover:opacity-90 transition-all"
                          >
                            <MapPin size={24} /> I Have Arrived
                          </button>
                        )}
                        {activeRide.status === 'arrived' && (
                          <button 
                            onClick={() => updateRideStatus('started')}
                            className="flex-1 flex items-center justify-center gap-3 bg-brand-gold text-brand-green py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-gold/20 hover:opacity-90 transition-all"
                          >
                            <Play size={24} /> Start Trip
                          </button>
                        )}
                        {activeRide.status === 'started' && (
                          <button 
                            onClick={() => updateRideStatus('completed')}
                            className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 hover:opacity-90 transition-all"
                          >
                            <CheckCircle size={24} /> Complete Trip
                          </button>
                        )}
                     </div>

                     <div className="p-4 bg-gray-50 rounded-2xl flex gap-4 text-gray-500 italic text-sm">
                        <Shield size={18} className="shrink-0 text-brand-gold" />
                        <p>Keep your status updated for accurate customer tracking. Safety first!</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Safety Badges for Trust factor */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
         {[
           { label: 'Local Resident', icon: <MapPin size={18} /> },
           { label: 'Valley Expert', icon: <Navigation size={18} /> },
           { label: '24/7 Support', icon: <Shield size={18} /> },
           { label: 'Safe Car', icon: <Car size={18} /> },
         ].map((badge, i) => (
           <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100">
              <div className="text-brand-gold">{badge.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{badge.label}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default DriverDashboard;
