import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const PrivacyPolicy = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <div className="space-y-8 text-gray-600">
        <p className="text-sm italic">Effective Date: May 12, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">1. Information We Collect</h2>
          <p>We collect information to provide better services to our users. This includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, phone number, and email address when you book a ride or register as a driver.</li>
            <li><strong>Location Data:</strong> We collect pickup and drop-off locations to facilitate transport services.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website and application.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and confirm your bookings.</li>
            <li>To enable drivers to find your pickup location.</li>
            <li>To send important updates regarding your trip.</li>
            <li>To improve our services and user experience.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We only share data with drivers necessary for completing your ride (e.g., your name and pickup location). We may disclose information if required by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-green">5. Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal data stored with us. To do so, please contact us at flust786@gmail.com.
          </p>
        </section>

        <section className="space-y-4 border-t border-gray-100 pt-8">
          <h2 className="text-xl font-bold text-brand-green">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
            <strong>Email:</strong> privacy@valleyride.in<br />
            <strong>Phone:</strong> +91 60065 80370
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
};

export default PrivacyPolicy;
