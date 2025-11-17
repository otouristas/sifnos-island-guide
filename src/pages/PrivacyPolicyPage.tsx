import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy - HotelsSifnos.com"
        description="Our privacy policy details how we collect, use, and protect your information when using HotelsSifnos.com, the Sifnos Island hotel directory."
        keywords={['privacy policy', 'sifnos hotels privacy', 'data protection', 'cookie policy']}
        canonical="https://hotelssifnos.com/privacy-policy"
      />
      
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: "/privacy-policy" }
          ]}
        />
      
        <h1 className="section-title mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">Last updated: May 5, 2026</p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">1. Introduction</h2>
            <p className="mb-4">
              Welcome to HotelsSifnos.com. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            
            <p className="mb-4">
              HotelsSifnos.com is a directory of accommodations in Sifnos, Greece. We provide hotel listings and information to help travelers plan their stay on the island. Hotels pay us to be listed on our directory, and we do not receive commissions from bookings made through our site. We provide inquiry forms that connect directly to the hotels' email addresses or affiliate links to platforms like Booking.com.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">2. The Data We Collect</h2>
            <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped as follows:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Identity Data</strong>: includes first name, last name.</li>
              <li><strong>Contact Data</strong>: includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong>: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong>: includes information about how you use our website.</li>
              <li><strong>Marketing and Communications Data</strong>: includes your preferences in receiving marketing from us.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">3. How We Use Your Data</h2>
            <p className="mb-4">We use your data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>To respond to inquiries you submit through our contact forms</li>
              <li>To forward your accommodation inquiries to the relevant hotels</li>
              <li>To provide you with information about Sifnos and its accommodations</li>
              <li>To improve our website and services</li>
              <li>To send newsletters if you have subscribed</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">4. Third-Party Links</h2>
            <p className="mb-4">
              Our website may include links to third-party websites, including hotel websites and booking platforms like Booking.com. Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">5. Cookies</h2>
            <p className="mb-4">
              We use cookies to distinguish you from other users of our website, to provide you with a good experience when you browse our website, and to improve our site. Please see our <Link to="/cookie-policy" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Cookie Policy</Link> for more information about the cookies we use.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">6. Data Security</h2>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">7. Data Retention</h2>
            <p className="mb-4">
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Inquiry data is typically retained for up to 2 years.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">8. Your Legal Rights</h2>
            <p className="mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:<br />
              Email: <a href="mailto:hello@hotelssifnos.com" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">hello@hotelssifnos.com</a>
            </p>
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                This Privacy Policy was last updated on May 5, 2026 and will be reviewed regularly. Please check back for any updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
