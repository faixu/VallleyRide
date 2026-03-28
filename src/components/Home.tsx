import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Shield, 
  Clock, 
  Star, 
  ChevronRight, 
  Menu, 
  X, 
  Car, 
  CheckCircle2, 
  ArrowRight,
  Mail,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import BookingForm from './BookingForm';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteContent, setSiteContent] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch dynamic site content
    const unsubscribe = onSnapshot(doc(db, 'site_content', 'main'), (doc) => {
      if (doc.exists()) {
        setSiteContent(doc.data());
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Our Fleet', href: '#fleet' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    {
      title: 'Airport Transfers',
      desc: 'Seamless pickup and drop from Srinagar Airport to any destination in Kashmir.',
      icon: <Car className="text-brand-gold" size={32} />
    },
    {
      title: 'Local Sightseeing',
      desc: 'Explore Srinagar, Dal Lake, Mughal Gardens with our expert local drivers.',
      icon: <MapPin className="text-brand-gold" size={32} />
    },
    {
      title: 'Outstation Trips',
      desc: 'Comfortable long-distance rides to Gulmarg, Pahalgam, Sonamarg, and beyond.',
      icon: <ChevronRight className="text-brand-gold" size={32} />
    },
    {
      title: 'Tour Packages',
      desc: 'Customized 3-7 day tour packages for families and honeymoon couples.',
      icon: <Star className="text-brand-gold" size={32} />
    }
  ];

  const fleet = [
    { name: 'Swift Dzire / Etios', type: 'Sedan', seats: '4+1', price: 'Starting ₹2500/day', img: 'https://picsum.photos/seed/sedan/600/400' },
    { name: 'Innova Crysta', type: 'Premium SUV', seats: '6+1', price: 'Starting ₹4500/day', img: 'https://picsum.photos/seed/suv/600/400' },
    { name: 'Tempo Traveller', type: 'Luxury Van', seats: '12-17', price: 'Starting ₹6000/day', img: 'https://picsum.photos/seed/van/600/400' },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green p-2 rounded-lg">
              <Car className="text-brand-gold" size={24} />
            </div>
            <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-brand-green' : 'text-white'}`}>
              VALLEY<span className="text-brand-gold">RIDE</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`font-semibold hover:text-brand-gold transition-colors ${scrolled ? 'text-brand-green' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <a href="tel:+916006580370" className="btn-primary flex items-center gap-2">
              <Phone size={18} /> Call Now
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-brand-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl p-6 md:hidden flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-brand-green border-b border-gray-100 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <a href="tel:+916006580370" className="btn-primary text-center py-4">Call Now</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteContent?.heroImage || "https://picsum.photos/seed/kashmir/1920/1080"} 
            alt="Kashmir Landscape" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white space-y-6"
          >
            <span className="bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase border border-brand-gold/30">
              Premium Cab Service in Kashmir
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tighter">
              {siteContent?.heroTitle || "Ride Through Kashmir with"} <span className="text-brand-gold">{siteContent?.heroTitleAccent || "Comfort & Trust"}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg">
              {siteContent?.heroSubtitle || "Book your premium taxi for airport transfers, local sightseeing, and outstation trips. Reliable, safe, and scenic journeys await."}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href={`tel:${siteContent?.phone || "+916006580370"}`} className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
                <Phone size={20} /> Book via Call
              </a>
              <a href={`https://wa.me/${(siteContent?.phone || "916006580370").replace(/\+/g, '')}`} className="btn-secondary px-8 py-4 text-lg flex items-center gap-2">
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-brand-green py-10 border-y border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Happy Customers', val: '10,000+' },
            { label: 'Verified Drivers', val: '50+' },
            { label: 'Years Experience', val: '12+' },
            { label: 'Luxury Fleet', val: '25+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-brand-gold text-3xl font-bold">{stat.val}</p>
              <p className="text-white/60 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-green tracking-tighter">Our Premium Services</h2>
            <p className="text-gray-600 text-lg">We provide a wide range of transportation services tailored to your needs in the beautiful valley of Kashmir.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-brand-green">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-green tracking-tighter">Why Choose Valley Ride?</h2>
            <div className="space-y-6">
              {[
                { title: 'Professional Local Drivers', desc: 'Our drivers are locals who know every corner of Kashmir and prioritize your safety.', icon: <Shield className="text-brand-gold" /> },
                { title: 'Transparent Pricing', desc: 'No hidden costs. What we quote is what you pay. Competitive rates for all routes.', icon: <CheckCircle2 className="text-brand-gold" /> },
                { title: '24/7 Customer Support', desc: 'We are always available to assist you, from booking to your final destination.', icon: <Clock className="text-brand-gold" /> },
                { title: 'Clean & Sanitized Cars', desc: 'Your health is our priority. All vehicles are thoroughly cleaned before every trip.', icon: <Car className="text-brand-gold" /> },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="bg-brand-green/5 p-3 rounded-xl h-fit">{item.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-green mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {siteContent?.aboutText && (
              <div className="mt-8 p-6 bg-brand-green/5 rounded-2xl border border-brand-green/10">
                <p className="text-gray-700 leading-relaxed italic">
                  {siteContent.aboutText}
                </p>
              </div>
            )}
          </div>
          <div className="relative">
            <img 
              src={siteContent?.aboutImage || "https://picsum.photos/seed/driver/800/1000"} 
              alt="Professional Driver" 
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl hidden md:block border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-brand-gold">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="font-bold text-brand-green">4.9/5 Rating</span>
              </div>
              <p className="text-gray-600 italic">"Best cab service in Srinagar. Very professional and punctual."</p>
              <p className="font-bold mt-2 text-brand-green">— Rahul Sharma</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="section-padding bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Our Luxury Fleet</h2>
            <p className="text-white/60 text-lg">Choose from our range of well-maintained vehicles for a comfortable journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {fleet.map((car, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 group"
              >
                <div className="h-64 overflow-hidden">
                  <img src={car.img} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">{car.name}</h3>
                      <p className="text-brand-gold font-semibold">{car.type}</p>
                    </div>
                    <span className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-lg text-sm font-bold">{car.seats} Seats</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{car.price}</p>
                  <a href="tel:+916006580370" className="btn-secondary w-full py-3 flex items-center justify-center gap-2">
                    Book Now <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-green tracking-tighter">What Our Travelers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ananya Iyer', text: 'Valley Ride made our Kashmir trip unforgettable. The driver was so polite and knew all the best spots for photos!', loc: 'Bangalore' },
              { name: 'Vikram Singh', text: 'Punctual and professional. The Innova was spotless and the drive to Gulmarg was very smooth. Highly recommended.', loc: 'Delhi' },
              { name: 'Sarah Wilson', text: 'As a solo traveler, safety was my priority. Valley Ride provided a safe and wonderful experience throughout my 5-day stay.', loc: 'London' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 italic relative">
                <div className="text-brand-gold mb-4 flex gap-1">
                  {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 mb-6">"{t.text}"</p>
                <div>
                  <p className="font-bold text-brand-green">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-brand-gold py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green tracking-tighter">Ready to Explore Kashmir?</h2>
          <div className="flex gap-4">
            <a href="tel:+916006580370" className="bg-brand-green text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <Phone size={20} /> Call Now
            </a>
            <a href="https://wa.me/916006580370" className="bg-white text-brand-green px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
              <MessageCircle size={20} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-green tracking-tighter">Get in Touch</h2>
            <p className="text-gray-600 text-lg">Have questions or want a custom quote? Reach out to us via any of the channels below.</p>
            
            <div className="space-y-6">
              <a href={`tel:${siteContent?.phone || "+916006580370"}`} className="flex items-center gap-4 group">
                <div className="bg-brand-green text-white p-4 rounded-2xl group-hover:bg-brand-gold transition-colors"><Phone size={24} /></div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Call Us</p>
                  <p className="text-xl font-bold text-brand-green">{siteContent?.phone || "+91 60065 80370"}</p>
                </div>
              </a>
              <a href={`https://wa.me/${(siteContent?.phone || "916006580370").replace(/\+/g, '')}`} className="flex items-center gap-4 group">
                <div className="bg-green-500 text-white p-4 rounded-2xl group-hover:bg-green-600 transition-colors"><MessageCircle size={24} /></div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">WhatsApp</p>
                  <p className="text-xl font-bold text-brand-green">{siteContent?.phone || "+91 60065 80370"}</p>
                </div>
              </a>
              <a href={`mailto:${siteContent?.email || "flust786@gmail.com"}`} className="flex items-center gap-4 group">
                <div className="bg-brand-gold text-white p-4 rounded-2xl group-hover:bg-brand-green transition-colors"><Mail size={24} /></div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Email Us</p>
                  <p className="text-xl font-bold text-brand-green">{siteContent?.email || "flust786@gmail.com"}</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="bg-brand-green text-white p-4 rounded-2xl"><MapPin size={24} /></div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Location</p>
                  <p className="text-xl font-bold text-brand-green">{siteContent?.address || "Srinagar, Kashmir, India"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-3xl overflow-hidden h-[400px] lg:h-full shadow-inner relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col gap-2">
              <MapPin size={48} />
              <p className="font-bold">Google Maps Embed Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-green text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Car className="text-brand-gold" size={32} />
              <span className="text-3xl font-bold tracking-tighter">VALLEY<span className="text-brand-gold">RIDE</span></span>
            </div>
            <p className="text-white/60 leading-relaxed">Your trusted travel partner in Kashmir. Providing premium cab services with comfort, safety, and reliability since 2012.</p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-brand-gold transition-colors"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-brand-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-brand-gold transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-brand-gold">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              {navLinks.map(link => (
                <li key={link.name}><a href={link.href} className="hover:text-white transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-brand-gold">Services</h4>
            <ul className="space-y-4 text-white/60">
              <li>Airport Transfers</li>
              <li>Local Sightseeing</li>
              <li>Outstation Trips</li>
              <li>Tour Packages</li>
              <li>Luxury Fleet</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-brand-gold">Contact Info</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-center gap-3"><Phone size={18} className="text-brand-gold" /> {siteContent?.phone || "+91 60065 80370"}</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-brand-gold" /> {siteContent?.email || "flust786@gmail.com"}</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-brand-gold" /> {siteContent?.address || "Srinagar, Kashmir"}</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2024 Valley Ride Kashmir. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${(siteContent?.phone || "916006580370").replace(/\+/g, '')}`} 
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default Home;
