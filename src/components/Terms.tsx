import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const Terms = () => {
  return (
    <StaticPageLayout title="Terms & Conditions">
      <div className="space-y-8 text-gray-600">
        <p className="text-sm italic">Last Updated: May 12, 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">1. Introduction</h2>
          <p>
            Welcome to Valley Ride. By using our website, mobile application, or booking services, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">2. Booking Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>A booking is only confirmed once you receive a confirmation message or email.</li>
            <li>For outstation trips, a minimum advance payment of 20% may be required.</li>
            <li>Users must provide accurate pickup location and contact details.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">3. Cancellation & Refunds</h2>
          <p>We understand plans change. Our cancellation policy is as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free cancellation up to 24 hours before the scheduled pickup.</li>
            <li>50% cancellation fee applies for cancellations between 12-24 hours.</li>
            <li>No refund for cancellations within 12 hours of the pickup time.</li>
            <li>In case of road closures or extreme weather (common in Kashmir), we offer full refunds or free rescheduling.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Passengers are expected to behave respectfully towards drivers.</li>
            <li>Consumption of alcohol or illegal substances inside the vehicle is strictly prohibited.</li>
            <li>Any damage caused to the vehicle by the passenger will be charged as per actual costs.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">5. Limitation of Liability</h2>
          <p>
            Valley Ride acts as a platform to connect travelers with verified drivers. While we ensure all partners are professional, Valley Ride is not liable for indirect losses, personal injuries during the trip, or items left behind in the vehicle, though we will assist in recovery efforts.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold text-brand-green">Governing Law</h2>
          <p>
            These terms are governed by the laws of India and are subject to the exclusive jurisdiction of the courts in Srinagar, J&K.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
};

export default Terms;
