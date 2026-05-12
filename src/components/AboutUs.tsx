import React from 'react';
import StaticPageLayout from './StaticPageLayout';
import { Shield, Users, MapPin, Star } from 'lucide-react';

const AboutUs = () => {
  return (
    <StaticPageLayout title="About Us">
      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-brand-green">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2012, Valley Ride began with a simple mission: to provide reliable, safe, and professional transportation services in the beautiful valley of Kashmir. What started with just two vehicles has grown into a premium fleet of over 25 luxury cars, dedicated to making every journey as breathtaking as the landscape.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We understand that travel in Kashmir is not just about moving from point A to point B; it's about the experience, the views, and the stories told along the way. That's why we hand-pick our drivers, ensuring they are not just experts on the road, but also friendly companions who know the rich history and hidden gems of our homeland.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 py-8">
          <div className="p-6 bg-brand-green/5 rounded-2xl border border-brand-green/10">
            <h3 className="text-xl font-bold text-brand-green mb-2 flex items-center gap-2">
              <Shield className="text-brand-gold" size={20} /> Our Mission
            </h3>
            <p className="text-gray-600">To be the most trusted travel partner in Kashmir, providing world-class service with a local heart.</p>
          </div>
          <div className="p-6 bg-brand-green/5 rounded-2xl border border-brand-green/10">
            <h3 className="text-xl font-bold text-brand-green mb-2 flex items-center gap-2">
              <Star className="text-brand-gold" size={20} /> Our Vision
            </h3>
            <p className="text-gray-600">To revolutionize local tourism by setting new standards in safety, transparency, and customer satisfaction.</p>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-brand-green">Why We Are Different</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-brand-gold/10 p-3 rounded-full h-fit"><Users className="text-brand-gold" size={24} /></div>
              <div>
                <h4 className="text-lg font-bold text-brand-green">Hand-Picked Drivers</h4>
                <p className="text-gray-600">Every driver undergoes a rigorous background check and training in customer hospitality and safe mountain driving.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-brand-gold/10 p-3 rounded-full h-fit"><MapPin className="text-brand-gold" size={24} /></div>
              <div>
                <h4 className="text-lg font-bold text-brand-green">Local Expertise</h4>
                <p className="text-gray-600">Our team consists entirely of locals who share a deep love for Kashmir and a commitment to its prosperity through sustainable tourism.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">Company Details</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500">
            <p><strong>Registered Name:</strong> Valley Ride Kashmir Pvt. Ltd.</p>
            <p><strong>Headquarters:</strong> Srinagar, Kashmir, J&K - 190001</p>
            <p><strong>Contact:</strong> +91 60065 80370</p>
            <p><strong>Email:</strong> info@valleyride.in</p>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
};

export default AboutUs;
