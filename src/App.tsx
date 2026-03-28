import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Users, 
  Star, 
  ChevronRight, 
  Menu, 
  X,
  Car,
  Plane,
  Map,
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-green text-white py-3 shadow-lg' : 'bg-transparent text-white py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Car className="text-brand-gold w-8 h-8" />
          <span className="text-2xl font-bold tracking-tighter">VALLEY<span className="text-brand-gold">RIDE</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#services" className="hover:text-brand-gold transition-colors">Services</a>
          <a href="#routes" className="hover:text-brand-gold transition-colors">Routes</a>
          <a href="#fleet" className="hover:text-brand-gold transition-colors">Fleet</a>
          <a href="#contact" className="hover:text-brand-gold transition-colors">Contact</a>
          <a href="tel:+919876543210" className="btn-primary py-2 text-sm">
            <Phone size={16} /> Call Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-green p-6 flex flex-col gap-4 md:hidden border-t border-white/10"
          >
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#routes" onClick={() => setIsMenuOpen(false)}>Routes</a>
            <a href="#fleet" onClick={() => setIsMenuOpen(false)}>Fleet</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <a href="tel:+919876543210" className="btn-primary w-full">
              <Phone size={18} /> Call Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&q=80&w=1920" 
          alt="Kashmir Mountains" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Ride Through Kashmir with <span className="text-brand-gold italic">Comfort & Trust</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-xl">
            Book reliable cabs for tours, airport transfers & local travel. Experience the paradise on wheels.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#booking" className="btn-primary text-lg px-8">Book Now</a>
            <a href="https://wa.me/919876543210" className="btn-secondary text-lg px-8 bg-green-600 border-none">
              <MessageCircle size={20} /> WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 rounded-2xl"
          id="booking"
        >
          <h3 className="text-2xl font-bold mb-6 text-brand-green">Check Availability</h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <MapPin size={14} /> Pickup Location
              </label>
              <input type="text" placeholder="e.g. Srinagar Airport" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <MapPin size={14} /> Drop Location
              </label>
              <input type="text" placeholder="e.g. Gulmarg" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Calendar size={14} /> Date
                </label>
                <input type="date" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Users size={14} /> Passengers
                </label>
                <select className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                  <option>1-4</option>
                  <option>5-7</option>
                  <option>8+</option>
                </select>
              </div>
            </div>
            <button type="button" className="btn-secondary w-full py-4 text-lg mt-4">
              Check Availability
            </button>
          </form>
          <p className="text-xs text-center mt-4 text-gray-500">
            * Limited availability for peak season. Book early!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const TrustStats = () => {
  const stats = [
    { icon: <Users className="text-brand-gold" />, label: "1000+ Happy Customers", sub: "Trusted by travelers" },
    { icon: <Clock className="text-brand-gold" />, label: "24/7 Service", sub: "Always here for you" },
    { icon: <ShieldCheck className="text-brand-gold" />, label: "Verified Drivers", sub: "Safety is our priority" },
    { icon: <Car className="text-brand-gold" />, label: "Clean & Comfortable", sub: "Premium fleet" },
  ];

  return (
    <section className="bg-brand-green py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center text-white flex flex-col items-center gap-2">
            <div className="bg-white/10 p-4 rounded-full mb-2">{stat.icon}</div>
            <h4 className="font-bold text-lg">{stat.label}</h4>
            <p className="text-xs opacity-70 uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <Plane />, title: "Airport Transfers", desc: "Punctual pickup and drop-off at Srinagar International Airport." },
    { icon: <Map />, title: "Local City Rides", desc: "Explore Srinagar's Dal Lake, Mughal Gardens, and old city with ease." },
    { icon: <ChevronRight />, title: "Outstation Trips", desc: "Reliable transport to Gulmarg, Pahalgam, Sonmarg, and beyond." },
    { icon: <Clock />, title: "Full-Day Rentals", desc: "Keep a car and driver at your disposal for the entire day." },
    { icon: <Star />, title: "Tour Packages", desc: "Customized multi-day tour packages for families and couples." },
  ];

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-green mb-4">Our Premium Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide a wide range of transport solutions tailored to your needs in the beautiful valley of Kashmir.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={i} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4"
            >
              <div className="text-brand-gold bg-brand-gold/10 p-3 rounded-xl">{s.icon}</div>
              <h3 className="text-xl font-bold text-brand-green">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              <button className="text-brand-gold font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                Book This <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    "Professional & Polite Drivers",
    "Transparent & Affordable Pricing",
    "Sanitized & Well-Maintained Cars",
    "On-Time Service Guarantee",
    "Deep Local Route Expertise",
    "No Hidden Charges"
  ];

  return (
    <section className="section-padding grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?auto=format&fit=crop&q=80&w=800" 
          alt="Driver in Kashmir" 
          className="rounded-3xl shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-8 -right-8 bg-brand-gold p-8 rounded-2xl shadow-xl hidden md:block">
          <p className="text-brand-green font-bold text-3xl">10+</p>
          <p className="text-brand-green text-sm font-medium">Years of Experience</p>
        </div>
      </div>
      <div>
        <h2 className="text-4xl font-bold text-brand-green mb-6">Why Choose Valley Ride?</h2>
        <p className="text-gray-600 mb-8 text-lg">We aren't just a cab service; we are your local travel partners in Kashmir. We ensure your journey is as beautiful as the destination.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="text-brand-gold shrink-0" size={20} />
              <span className="font-medium text-gray-700">{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <a href="#booking" className="btn-secondary inline-flex">Get a Quote Now</a>
        </div>
      </div>
    </section>
  );
};

const PopularRoutes = () => {
  const routes = [
    { from: "Srinagar", to: "Gulmarg", price: "₹2,500", duration: "2.5 Hours", img: "https://images.unsplash.com/photo-1590050752117-23a9d7fc6bbd?auto=format&fit=crop&q=80&w=400" },
    { from: "Srinagar", to: "Pahalgam", price: "₹3,200", duration: "3.5 Hours", img: "https://images.unsplash.com/photo-1589136777351-fdc9c9ca0031?auto=format&fit=crop&q=80&w=400" },
    { from: "Srinagar", to: "Sonmarg", price: "₹2,800", duration: "3 Hours", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <section id="routes" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-green mb-4">Popular Routes</h2>
          <p className="text-gray-600">Fixed price estimates for our most requested destinations.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {routes.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={r.img} alt={r.to} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-brand-green">{r.from} → {r.to}</h3>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1"><Clock size={14} /> {r.duration}</span>
                  <span className="font-bold text-brand-gold text-lg">{r.price}*</span>
                </div>
                <button className="btn-primary w-full">Book This Route</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Fleet = () => {
  const cars = [
    { type: "Hatchback", model: "Swift / Alto", capacity: "4+1", price: "Budget Friendly", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400" },
    { type: "Sedan", model: "Dzire / Etios", capacity: "4+1", price: "Comfortable", img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=400" },
    { type: "SUV", model: "Innova / Scorpio", capacity: "6+1", price: "Premium / Group", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <section id="fleet" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-green mb-4">Our Vehicle Fleet</h2>
          <p className="text-gray-600">Choose the perfect ride for your comfort and group size.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-6 text-center">
              <img src={c.img} alt={c.type} className="w-full h-40 object-contain mb-6" referrerPolicy="no-referrer" />
              <h3 className="text-2xl font-bold text-brand-green mb-2">{c.type}</h3>
              <p className="text-gray-500 mb-4">{c.model}</p>
              <div className="flex justify-center gap-4 text-sm font-semibold text-gray-700 mb-6">
                <span className="flex items-center gap-1"><Users size={16} /> {c.capacity}</span>
                <span className="text-brand-gold">{c.price}</span>
              </div>
              <button className="btn-secondary w-full">Select {c.type}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { name: "Anjali Sharma", text: "Amazing service! The driver was very professional and knew all the best spots in Gulmarg. Highly recommended.", rating: 5 },
    { name: "Rahul Verma", text: "Valley Ride made our Kashmir trip stress-free. The car was clean and the pricing was very transparent.", rating: 5 },
    { name: "David Miller", text: "Best cab service in Srinagar. Punctual and reliable for airport transfers.", rating: 4 },
  ];

  return (
    <section className="section-padding bg-brand-green text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Travelers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} className={idx < r.rating ? "text-brand-gold fill-brand-gold" : "text-gray-400"} />
                ))}
              </div>
              <p className="text-lg italic mb-6 opacity-90">"{r.text}"</p>
              <p className="font-bold text-brand-gold">— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold text-brand-green mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">Have questions or need a custom tour package? Reach out to us anytime.</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold"><Phone /></div>
              <div>
                <p className="font-bold text-brand-green">Call Us</p>
                <a href="tel:+919876543210" className="text-lg text-gray-600 hover:text-brand-gold">+91 98765 43210</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold"><MessageCircle /></div>
              <div>
                <p className="font-bold text-brand-green">WhatsApp</p>
                <a href="https://wa.me/919876543210" className="text-lg text-gray-600 hover:text-brand-gold">+91 98765 43210</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold"><MapPin /></div>
              <div>
                <p className="font-bold text-brand-green">Office Location</p>
                <p className="text-lg text-gray-600">Boulevard Road, Srinagar, Kashmir - 190001</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-brand-gold hover:text-white transition-all"><Instagram /></a>
            <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-brand-gold hover:text-white transition-all"><Facebook /></a>
            <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-brand-gold hover:text-white transition-all"><Twitter /></a>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105844.2091219602!2d74.7243916!3d34.0836508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1855686e3c505%3A0x4f899a7512810c0!2sSrinagar!5e0!3m2!1sen!2sin!4v1711560000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-green text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Car className="text-brand-gold w-8 h-8" />
            <span className="text-2xl font-bold tracking-tighter">VALLEY<span className="text-brand-gold">RIDE</span></span>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Premium cab service in Kashmir. We provide reliable, safe, and comfortable transport solutions for tourists and locals alike. Explore the paradise with us.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li><a href="#services" className="hover:text-brand-gold">Services</a></li>
            <li><a href="#routes" className="hover:text-brand-gold">Popular Routes</a></li>
            <li><a href="#fleet" className="hover:text-brand-gold">Our Fleet</a></li>
            <li><a href="#contact" className="hover:text-brand-gold">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-6">Services</h4>
          <ul className="space-y-4 text-gray-400">
            <li>Airport Transfers</li>
            <li>Gulmarg Day Trip</li>
            <li>Pahalgam Tour</li>
            <li>Sonmarg Excursion</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Valley Ride Kashmir. All rights reserved. Designed for excellence.</p>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => {
  return (
    <motion.a 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      href="https://wa.me/919876543210"
      className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all active:scale-90 flex items-center justify-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle size={32} />
    </motion.a>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <TrustStats />
      <Services />
      <WhyChooseUs />
      <PopularRoutes />
      <Fleet />
      <Testimonials />
      
      {/* CTA Strip */}
      <section className="bg-brand-gold py-12 px-6 text-center">
        <h2 className="text-3xl font-bold text-brand-green mb-6">Need a ride right now? We are available 24/7.</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+919876543210" className="btn-secondary px-10 text-lg">Call Now</a>
          <a href="https://wa.me/919876543210" className="btn-primary px-10 text-lg bg-white border-none">WhatsApp Us</a>
        </div>
      </section>

      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
