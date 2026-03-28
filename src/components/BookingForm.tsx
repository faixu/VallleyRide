import React, { useState } from 'react';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import { db, addDoc, collection, handleFirestoreError, OperationType } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    date: '',
    passengers: '1-4',
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
        passengers: '1-4',
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
              <Users size={14} /> Passengers
            </label>
            <select 
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              <option>1-4</option>
              <option>5-7</option>
              <option>8+</option>
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
