import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Car, Shield, Navigation, Users, ChevronRight, X, Heart, Globe, Award } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  image: string;
  rating: number;
  trips: number;
  vehicleModel: string;
  plateNumber: string;
  distance: string;
  category: string;
  languages: string[];
  bio: string;
  reviews: { name: string; comment: string; rating: number }[];
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
  { id: 'sedan', name: 'Executive Sedan', basePrice: '₹2500', icon: <Car size={24} />, capacity: '4', description: 'Swift Dzire, Toyota Etios' },
  { id: 'suv', name: 'Premium SUV', basePrice: '₹4500', icon: <Users size={24} />, capacity: '7', description: 'Innova Crysta, Marazzo' },
  { id: 'luxury', name: 'Luxury Van', basePrice: '₹6000', icon: <Shield size={24} />, capacity: '12-17', description: 'Force Tempo Traveller' },
];

const MOCK_DRIVERS: Driver[] = [
  {
    id: '1',
    name: 'Bashir Ahmed',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    trips: 1240,
    vehicleModel: 'White Swift Dzire',
    plateNumber: 'JK-01-AB-1234',
    distance: '0.8 km away',
    category: 'sedan',
    languages: ['Kashmiri', 'Hindi', 'English'],
    bio: 'Professional driver with 10 years of experience in the Kashmir Valley. I know the best secret spots for photography!',
    reviews: [
      { name: 'Sameer', comment: 'Very polite and knowledgeable about local history.', rating: 5 },
      { name: 'Sarah', comment: 'Safe driving through tough mountain roads.', rating: 5 }
    ]
  },
  {
    id: '2',
    name: 'Mohammad Yusuf',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    trips: 856,
    vehicleModel: 'Toyota Innova Crysta',
    plateNumber: 'JK-01-XX-9988',
    distance: '1.2 km away',
    category: 'suv',
    languages: ['Kashmiri', 'Hindi', 'Urdu'],
    bio: 'Customer satisfaction is my priority. My vehicle is always sanitized and stocked with water bottles.',
    reviews: [
      { name: 'Amit', comment: 'Spacious car and very clean.', rating: 5 }
    ]
  },
  {
    id: '3',
    name: 'Gulzar Wani',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 4.7,
    trips: 2100,
    vehicleModel: 'Luxury Tempo Traveller',
    plateNumber: 'JK-01-TT-5544',
    distance: '2.5 km away',
    category: 'luxury',
    languages: ['Kashmiri', 'Hindi'],
    bio: 'Specialist in group tours and multi-day long trips across Ladakh and Sonamarg.',
    reviews: [
      { name: 'Priya', comment: 'Great for our family trip. Very patient.', rating: 5 }
    ]
  },
  {
    id: '4',
    name: 'Imtiyaz Bhat',
    image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200',
    rating: 5.0,
    trips: 420,
    vehicleModel: 'Toyota Etios',
    plateNumber: 'JK-02-CP-4455',
    distance: '1.5 km away',
    category: 'sedan',
    languages: ['Kashmiri', 'Hindi', 'English'],
    bio: 'Young and energetic driver with deep knowledge of the best hiking trails and picnic spots.',
    reviews: [
      { name: 'John Doe', comment: 'Best driver I had in India. Really cool guy.', rating: 5 }
    ]
  }
];

const CabSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('sedan');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = MOCK_DRIVERS.filter(d => d.category === selectedCategory);

  const handleBook = (driverName: string) => {
    alert(`Confirmed! Driver ${driverName} is on the way to your location.`);
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

        {/* Driver Marketplace */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-brand-green flex items-center gap-2">
              <Navigation size={20} className="text-brand-gold" /> Available Drivers
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filteredDrivers.length} verified found
            </span>
          </div>

          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDrivers.map((driver) => (
                <motion.div
                  key={driver.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center transition-all hover:shadow-xl group"
                >
                  <div className="relative">
                    <img src={driver.image} alt={driver.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white" />
                    <div className="absolute -bottom-2 -right-2 bg-brand-gold text-brand-green p-1.5 rounded-lg shadow-lg">
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <h4 className="text-2xl font-black text-brand-green">{driver.name}</h4>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Shield size={12} fill="currentColor" /> Verified
                        </span>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          <Navigation size={12} /> {driver.distance}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:flex md:gap-8 gap-4 py-2">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vehicle</p>
                        <p className="text-sm font-bold text-gray-700">{driver.vehicleModel}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Experience</p>
                        <p className="text-sm font-bold text-gray-700">{driver.trips} Trips</p>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Plate Number</p>
                        <p className="text-sm font-bold text-brand-green font-mono">{driver.plateNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => setSelectedDriver(driver)}
                      className="flex-1 md:w-32 py-3 border-2 border-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:border-brand-gold hover:text-brand-gold transition-all"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => handleBook(driver.name)}
                      className="flex-1 md:w-32 py-3 bg-brand-gold text-brand-green rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-brand-gold/10 transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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
                    <img src={selectedDriver.image} alt={selectedDriver.name} className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-white" />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-green px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
                      <Star size={12} fill="currentColor" /> {selectedDriver.rating}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-4xl font-black text-brand-green tracking-tighter mb-2">{selectedDriver.name}</h3>
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
                    <p className="text-lg font-black text-brand-green">{selectedDriver.trips}+</p>
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
                    {selectedDriver.reviews.map((rev, i) => (
                      <div key={i} className="bg-gray-50 p-6 rounded-3xl space-y-2 relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-brand-gold">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} size={14} fill={rev.rating > j ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{rev.name}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">"{rev.comment}"</p>
                        <Heart size={16} className="absolute bottom-6 right-6 text-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 shrink-0">
                <button 
                  onClick={() => handleBook(selectedDriver.name)}
                  className="w-full btn-secondary py-5 rounded-2xl font-black text-lg shadow-[0_20px_50px_-10px_rgba(188,157,75,0.4)] flex items-center justify-center gap-3"
                >
                  <Car size={24} /> Book with {selectedDriver.name.split(' ')[0]}
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
