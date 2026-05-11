import React from 'react';
import CustomerDashboard from './CustomerDashboard';
import DriverDashboard from './DriverDashboard';
import { User, LogOut, ShieldAlert } from 'lucide-react';
import { signOut, auth } from '../firebase';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: any;
  profile: any;
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, profile, isAdmin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Universal Dashboard Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold overflow-hidden border border-gray-100 shadow-sm">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">{profile.displayName || 'User'}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                  {profile.role === 'driver' ? 'Verified Driver' : 'Kashmir Traveler'}
                </p>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                  >
                    <ShieldAlert size={10} /> Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors text-sm font-bold"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {profile.role === 'driver' ? (
          <DriverDashboard user={user} profile={profile} />
        ) : (
          <CustomerDashboard user={user} profile={profile} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
