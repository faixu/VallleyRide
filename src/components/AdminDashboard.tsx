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
  Car,
  Image as ImageIcon,
  Save,
  Upload,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { signOut, auth } from '../firebase';

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

interface Profile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'driver' | 'admin';
  status: string;
  verified: boolean;
}

interface Ride {
  id: string;
  customerId: string;
  customerName: string;
  pickup: { address: string };
  destination: { address: string };
  status: string;
  estimatedFare: number;
  createdAt: string;
}

interface DriverApplication {
  id: string;
  fullName: string;
  phoneNumber: string;
  vehicleModel: string;
  licenseDetails: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: any;
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'rides' | 'profiles' | 'content' | 'applications'>('bookings');
  
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
    const qBookings = query(collection(db, bookingsPath), orderBy('createdAt', 'desc'));
    const unsubscribeBookings = onSnapshot(qBookings, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, bookingsPath);
    });

    // Listen for real-time rides
    const ridesPath = 'rides';
    const qRides = query(collection(db, ridesPath), orderBy('createdAt', 'desc'));
    const unsubscribeRides = onSnapshot(qRides, (snapshot) => {
      setRides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ride[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, ridesPath);
    });

    // Listen for profiles
    const profilesPath = 'profiles';
    const unsubscribeProfiles = onSnapshot(collection(db, profilesPath), (snapshot) => {
      setProfiles(snapshot.docs.map(doc => ({ ...doc.data() })) as Profile[]);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, profilesPath);
    });

    // Listen for site content
    const contentDoc = doc(db, 'site_content', 'main');
    const unsubscribeContent = onSnapshot(contentDoc, (snapshot) => {
      if (snapshot.exists()) {
        setSiteContent(snapshot.data() as SiteContent);
      }
    });

    // Listen for driver applications
    const applicationsPath = 'driver_applications';
    const qApps = query(collection(db, applicationsPath), orderBy('createdAt', 'desc'));
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DriverApplication[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, applicationsPath);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeRides();
      unsubscribeProfiles();
      unsubscribeContent();
      unsubscribeApps();
    };
  }, []);

  const toggleVerification = async (uid: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'profiles', uid), { verified: !current });
      toast.success("Verification status updated");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `profiles/${uid}`);
    }
  };

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
            <nav className="hidden md:flex items-center gap-2 ml-8 overflow-x-auto">
              {[
                { id: 'bookings', label: 'Legacy Bookings' },
                { id: 'rides', label: 'Real-time Rides' },
                { id: 'profiles', label: 'User Profiles' },
                { id: 'applications', label: 'Driver Apps' },
                { id: 'content', label: 'Manage Content' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-brand-green shadow-lg' : 'hover:bg-white/10'}`}
                >
                  {tab.label}
                </button>
              ))}
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
        {activeTab === 'bookings' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-brand-green">Legacy Bookings</h2>
              
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <Filter size={18} className="text-gray-400 ml-2" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent focus:outline-none text-sm font-semibold text-gray-700 pr-4"
                >
                  <option value="all">All Bookings</option>
                  {[...new Set(bookings.map(b => b.status))].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                <p className="text-gray-500">No bookings matching filters.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase">Route</p>
                          <div className="flex items-center gap-2 text-brand-green font-bold">
                            <MapPin size={16} /> <span>{booking.pickup} → {booking.drop}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase">Schedule</p>
                          <div className="flex items-center gap-2 text-gray-700 font-semibold uppercase">
                            <Calendar size={16} /> <span>{booking.date}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase">Contact</p>
                          <p className="font-bold text-brand-green">{booking.customerPhone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>{booking.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'rides' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-brand-green">Real-time Rides</h2>
            <div className="grid gap-6">
              {rides.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
                  <p className="text-gray-400">No real-time rides found.</p>
                </div>
              ) : (
                rides.map(ride => (
                  <div key={ride.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ride.status === 'requested' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {ride.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">#{ride.id.slice(0,8)}</span>
                       </div>
                       <p className="font-bold text-brand-green">{ride.pickup.address} → {ride.destination.address}</p>
                       <p className="text-sm text-gray-500">Customer: <span className="font-bold">{ride.customerName}</span></p>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                       <p className="text-2xl font-bold text-brand-green tracking-tighter">₹{ride.estimatedFare}</p>
                       <p className="text-xs text-gray-400">{format(new Date(ride.createdAt), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-brand-green">User Profiles</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Verification</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {profiles.map(p => (
                       <tr key={p.uid} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-gray-900">{p.displayName || 'No Name'}</p>
                             <p className="text-xs text-gray-400">{p.email}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.role === 'driver' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                               {p.role}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2 uppercase text-[10px] font-bold">
                                <div className={`w-2 h-2 rounded-full ${p.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                {p.status || 'offline'}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             {p.role === 'driver' ? (
                               <div className="flex items-center gap-2">
                                  {p.verified ? <Shield className="text-green-500" size={16} /> : <XCircle className="text-red-400" size={16} />}
                                  <span className="text-xs font-medium">{p.verified ? 'Verified' : 'Pending'}</span>
                               </div>
                             ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                             {p.role === 'driver' && (
                               <button 
                                 onClick={() => toggleVerification(p.uid, p.verified)}
                                 className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${p.verified ? 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white' : 'text-green-600 bg-green-50 hover:bg-green-600 hover:text-white'}`}
                               >
                                 {p.verified ? 'Revoke Verification' : 'Verify Driver'}
                               </button>
                             )}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-brand-green">Driver Applications</h2>
            <div className="grid gap-6">
              {applications.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
                  <p className="text-gray-400 font-medium">No applications received yet.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden group">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">#{app.id.slice(0, 8)}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">{app.fullName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5 font-bold text-brand-green">
                            <Phone size={14} /> {app.phoneNumber}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Car size={14} /> {app.vehicleModel}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">License Details</p>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium italic">{app.licenseDetails}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-6 self-stretch min-w-[200px]">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">Submitted On</p>
                        <p className="text-sm font-bold text-gray-700">
                          {app.createdAt?.seconds ? format(new Date(app.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Recently'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {app.status === 'pending' && (
                          <>
                            <button 
                              onClick={async () => {
                                await updateDoc(doc(db, 'driver_applications', app.id), { status: 'accepted' });
                                toast.success('Application marked as accepted');
                              }}
                              className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white p-3 rounded-xl transition-all shadow-sm"
                              title="Accept"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={async () => {
                                await updateDoc(doc(db, 'driver_applications', app.id), { status: 'rejected' });
                                toast.success('Application marked as rejected');
                              }}
                              className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-all shadow-sm"
                              title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={async () => {
                            if (window.confirm('Delete this application?')) {
                              await deleteDoc(doc(db, 'driver_applications', app.id));
                              toast.success('Application deleted');
                            }
                          }}
                          className="bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500 p-3 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
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
