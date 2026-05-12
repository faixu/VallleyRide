import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Car, Menu, X, Phone, Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Drive with Us', href: '/drive' },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      {/* Navbar (Simplified for static pages) */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-brand-green py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-brand-green p-2 rounded-lg border border-brand-gold/20">
              <Car className="text-brand-gold" size={24} />
            </div>
            <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-brand-green' : 'text-white'}`}>
              VALLEY<span className="text-brand-gold">RIDE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`font-semibold hover:text-brand-gold transition-colors ${scrolled ? 'text-brand-green' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <a href="tel:+916006580370" className="btn-primary flex items-center gap-2">
              <Phone size={18} /> Call Now
            </a>
          </div>

          <button className="md:hidden text-brand-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-brand-green pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tighter"
          >
            {title}
          </motion.h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="prose prose-lg prose-brand max-w-none shadow-sm border border-gray-100 p-8 md:p-12 rounded-[32px] bg-white"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-green text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Car className="text-brand-gold" size={32} />
              <span className="text-3xl font-bold tracking-tighter">VALLEY<span className="text-brand-gold">RIDE</span></span>
            </div>
            <p className="text-white/60 leading-relaxed">Your trusted travel partner in Kashmir. Providing premium cab services with comfort, safety, and reliability since 2012.</p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-brand-gold">Company</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/drive" className="hover:text-white transition-colors">Drive With Us</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-brand-gold">Support</h4>
            <ul className="space-y-4 text-white/60">
              <li>Help Center</li>
              <li>Contact Support</li>
              <li>How it Works</li>
              <li>Trust & Safety</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-brand-gold">Contact Info</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-center gap-3"><Phone size={18} className="text-brand-gold" /> +91 60065 80370</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-brand-gold" /> flust786@gmail.com</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-brand-gold" /> Srinagar, Kashmir</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 text-center text-white/40 text-sm">
          <p>© 2024 Valley Ride Kashmir. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StaticPageLayout;
