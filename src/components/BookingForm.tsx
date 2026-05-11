import React, { useState } from 'react';
import { MapPin, Calendar, Users, Clock, Car } from 'lucide-react';
import { db, addDoc, collection, handleFirestoreError, OperationType } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    date: '',
    vehicleType: 'economy',
    passengers: '1',
    customerPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickup || !formData.drop || !formData.date || !formData.customerPhone) {
      toast.error('Please fill all required fields.');
      return;
    }

    setLoading(true);
    const path = 'bookings';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast.success('Booking submitted successfully! We will contact you shortly.');
      setFormData({
        pickup: '',
        drop: '',
        date: '',
        vehicleType: 'economy',
        passengers: '1',
        customerPhone: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl" id="booking">
      <h3 className="text-2xl font-bold mb-6 text-brand-green">Check Availability</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <MapPin size={14} /> Pickup Location
          </label>
          <input 
            type="text" 
            required
            value={formData.pickup}
            onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
            placeholder="e.g. Srinagar Airport" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <MapPin size={14} /> Drop Location
          </label>
          <input 
            type="text" 
            required
            value={formData.drop}
            onChange={(e) => setFormData({ ...formData, drop: e.target.value })}
            placeholder="e.g. Gulmarg" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Car size={14} /> Select Cab / Vehicle Type
          </label>
          <select 
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold font-medium"
          >
            <option value="economy">Executive Sedan (4 Seats)</option>
            <option value="premium">Premium SUV (7 Seats)</option>
            <option value="suv">Luxury Van (12-17 Seats)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Calendar size={14} /> Date
            </label>
            <input 
              type="date" 
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Users size={14} /> No. of Persons
            </label>
            <select 
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(num => (
                <option key={num} value={num}>{num} Person{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Clock size={14} /> Phone Number
          </label>
          <input 
            type="tel" 
            required
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            placeholder="e.g. +91 60065 80370" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-secondary w-full py-4 text-lg mt-4 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Check Availability'}
        </button>
      </form>
      <p className="text-xs text-center mt-4 text-gray-500">
        * Limited availability for peak season. Book early!
      </p>
    </div>
  );
};

export default BookingForm;
