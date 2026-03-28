import React, { useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  setDoc,
  deleteDoc, 
  handleFirestoreError, 
  OperationType,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '../firebase';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Calendar,
  LogOut,
  ChevronDown,
  Filter,
  Edit,
  Image as ImageIcon,
  Save,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { signOut, auth } from '../firebase';

interface Booking {
  id: string;
  pickup: string;
  drop: string;
  date: string;
  passengers: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: any;
  customerPhone: string;
  customerEmail?: string;
}

interface SiteContent {
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  email: string;
  phone: string;
  address: string;
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'content'>('bookings');
  
  const [siteContent, setSiteContent] = useState<SiteContent>({
    heroTitle: 'Ride Through Kashmir with',
    heroTitleAccent: 'Comfort & Trust',
    heroSubtitle: 'Book premium cabs for airport transfers, local sightseeing, and outstation trips across the valley.',
    heroImage: 'https://picsum.photos/seed/kashmir/1920/1080',
    aboutTitle: 'Why Choose Valley Ride?',
    aboutText: 'Valley Ride is Kashmir\'s leading transport service provider, dedicated to offering safe, reliable, and comfortable travel experiences. Our fleet of well-maintained vehicles and professional drivers ensure that your journey through the paradise on earth is nothing short of perfect.',
    aboutImage: 'https://picsum.photos/seed/driver/800/1000',
    email: 'flust786@gmail.com',
    phone: '+91 6006580370',
    address: 'Srinagar, Kashmir, India'
  });

  useEffect(() => {
    // Listen for bookings
    const bookingsPath = 'bookings';
    const q = query(collection(db, bookingsPath), orderBy('createdAt', 'desc'));
    
    const unsubscribeBookings = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, bookingsPath);
    });

    // Listen for site content
    const contentDoc = doc(db, 'site_content', 'main');
    const unsubscribeContent = onSnapshot(contentDoc, (snapshot) => {
      if (snapshot.exists()) {
        setSiteContent(snapshot.data() as SiteContent);
      }
    });

    return () => {
      unsubscribeBookings();
      unsubscribeContent();
    };
  }, []);

  const handleContentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'site_content', 'main'), siteContent);
      toast.success('Site content updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'site_content/main');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'aboutImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `site/${field}-${Date.now()}`);
    const loadingToast = toast.loading('Uploading image...');

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setSiteContent(prev => ({ ...prev, [field]: url }));
      toast.success('Image uploaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image.', { id: loadingToast });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const path = `bookings/${id}`;
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      toast.success(`Booking ${status} successfully.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteBooking = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      toast.success('Booking deleted successfully.');
      setDeletingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-brand-green text-white py-6 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-tighter">VALLEY<span className="text-brand-gold">ADMIN</span></h1>
            <nav className="hidden md:flex items-center gap-4 ml-8">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'bookings' ? 'bg-white text-brand-green' : 'hover:bg-white/10'}`}
              >
                Bookings
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'content' ? 'bg-white text-brand-green' : 'hover:bg-white/10'}`}
              >
                Manage Content
              </button>
            </nav>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {activeTab === 'bookings' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-brand-green">Ride Bookings</h2>
              
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <Filter size={18} className="text-gray-400 ml-2" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent focus:outline-none text-sm font-semibold text-gray-700 pr-4"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-gray-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings found</h3>
                <p className="text-gray-500">When customers book rides, they will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Route</p>
                          <div className="flex items-center gap-2 text-brand-green font-bold">
                            <MapPin size={16} className="text-brand-gold" />
                            <span>{booking.pickup} → {booking.drop}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                          <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <Calendar size={16} className="text-brand-gold" />
                            <span>{booking.date}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                          <div className="flex flex-col gap-1">
                            <a href={`tel:${booking.customerPhone}`} className="flex items-center gap-2 text-brand-green font-bold hover:underline">
                              <Phone size={16} className="text-brand-gold" />
                              <span>{booking.customerPhone}</span>
                            </a>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Users size={14} />
                              <span>{booking.passengers} Passengers</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <p className="text-[10px] text-gray-400">
                              {booking.createdAt?.seconds ? format(new Date(booking.createdAt.seconds * 1000), 'MMM d, h:mm a') : 'Just now'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 lg:border-l lg:pl-6 border-gray-100">
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'completed')}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                        {deletingId === booking.id ? (
                          <div className="flex items-center gap-2 bg-red-50 p-1 rounded-lg border border-red-100">
                            <span className="text-[10px] font-bold text-red-600 px-2 uppercase">Delete?</span>
                            <button 
                              onClick={() => deleteBooking(booking.id)}
                              className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                              title="Confirm Delete"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              className="p-1.5 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-all"
                              title="Cancel Delete"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeletingId(booking.id)}
                            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            title="Delete Record"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-brand-green">Manage Site Content</h2>
              <button 
                onClick={handleContentUpdate}
                className="flex items-center gap-2 bg-brand-gold text-brand-green px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all"
              >
                <Save size={20} /> Save Changes
              </button>
            </div>

            <div className="grid gap-8">
              {/* Hero Section Content */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-brand-green/10 p-2 rounded-lg">
                    <Edit className="text-brand-green" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Hero Section</h3>
                </div>

                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Main Headline</label>
                      <input 
                        type="text" 
                        value={siteContent.heroTitle}
                        onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Headline Accent (Gold)</label>
                      <input 
                        type="text" 
                        value={siteContent.heroTitleAccent}
                        onChange={(e) => setSiteContent({ ...siteContent, heroTitleAccent: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subheadline</label>
                    <textarea 
                      rows={3}
                      value={siteContent.heroSubtitle}
                      onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Hero Background Image</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative group rounded-xl overflow-hidden h-40 border border-gray-100">
                          <img 
                            src={siteContent.heroImage} 
                            alt="Hero Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-brand-green px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                              <Upload size={18} /> Change Image
                              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImage')} accept="image/*" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs text-gray-400">Or paste an image URL directly:</p>
                        <input 
                          type="text" 
                          value={siteContent.heroImage}
                          onChange={(e) => setSiteContent({ ...siteContent, heroImage: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Section Content */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-brand-green/10 p-2 rounded-lg">
                    <Users className="text-brand-green" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">About Section</h3>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">About Title</label>
                    <input 
                      type="text" 
                      value={siteContent.aboutTitle}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutTitle: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">About Description</label>
                    <textarea 
                      rows={4}
                      value={siteContent.aboutText}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutText: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">About Image</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative group rounded-xl overflow-hidden h-40 border border-gray-100">
                          <img 
                            src={siteContent.aboutImage} 
                            alt="About Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-brand-green px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                              <Upload size={18} /> Change Image
                              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'aboutImage')} accept="image/*" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs text-gray-400">Or paste an image URL directly:</p>
                        <input 
                          type="text" 
                          value={siteContent.aboutImage}
                          onChange={(e) => setSiteContent({ ...siteContent, aboutImage: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-brand-green/10 p-2 rounded-lg">
                    <Phone className="text-brand-green" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Contact Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Public Email</label>
                    <input 
                      type="email" 
                      value={siteContent.email}
                      onChange={(e) => setSiteContent({ ...siteContent, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="text" 
                      value={siteContent.phone}
                      onChange={(e) => setSiteContent({ ...siteContent, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Full Address</label>
                    <input 
                      type="text" 
                      value={siteContent.address}
                      onChange={(e) => setSiteContent({ ...siteContent, address: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
