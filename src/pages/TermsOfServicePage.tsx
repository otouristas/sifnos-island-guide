
import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';

const TermsOfServicePage = () => {
  return (
    <>
      <SEO 
        title="Terms of Service - HotelsSifnos.com"
        description="Terms and conditions for using HotelsSifnos.com, the directory of accommodations in Sifnos Island, Greece."
        keywords={['terms of service', 'terms and conditions', 'sifnos hotels terms', 'legal']}
        canonical="https://hotelssifnos.com/terms-of-service"
      />
      
      <div className="page-container">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Terms of Service", href: "/terms-of-service" }
          ]}
          schemaType="BreadcrumbList"
        />
      
        <h1 className="section-title mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">Last updated: May 5, 2025</p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">1. Introduction</h2>
            <p className="mb-4">
              Welcome to HotelsSifnos.com. These terms and conditions outline the rules and regulations for the use of our website. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use HotelsSifnos.com if you do not accept all of the terms and conditions stated on this page.
            </p>
            
            <p className="mb-4">
              HotelsSifnos.com is a hotel directory for accommodations in Sifnos, Greece. We charge hotels to be listed on our site and do not receive commissions from bookings. We provide contact forms that connect users directly to hotels' email addresses or affiliate links to booking platforms.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">2. License to Use Website</h2>
            <p className="mb-4">
              Unless otherwise stated, HotelsSifnos.com and/or its licensors own the intellectual property rights for all material on HotelsSifnos.com. All intellectual property rights are reserved.
            </p>
            <p className="mb-4">
              You may view and/or print pages from the website for your own personal use subject to restrictions set in these terms and conditions.
            </p>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Republish material from HotelsSifnos.com</li>
              <li>Sell, rent or sub-license material from HotelsSifnos.com</li>
              <li>Reproduce, duplicate or copy material from HotelsSifnos.com</li>
              <li>Redistribute content from HotelsSifnos.com (unless content is specifically made for redistribution)</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">3. Disclaimer</h2>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).
            </p>
            <p className="mb-4">
              The information provided on HotelsSifnos.com about hotels and accommodations in Sifnos is obtained from the hotels themselves or public sources. While we make every effort to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">4. Listing Information and Bookings</h2>
            <p className="mb-4">
              HotelsSifnos.com is a directory service that provides information about accommodations in Sifnos. We are not a booking agent or tour operator. When you submit an inquiry through our forms, your information is sent directly to the hotel. When you click on booking links, you will be redirected to third-party booking platforms such as Booking.com.
            </p>
            <p className="mb-4">
              Any contract for accommodation you enter into is directly between you and the accommodation provider, not with HotelsSifnos.com. We are not responsible for any booking issues, cancellations, refunds, or the quality of stay you experience.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">5. User Content and Reviews</h2>
            <p className="mb-4">
              If you submit content to our site, including comments or reviews, you grant us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your content in any existing or future media. You also grant us the right to sub-license these rights and the right to bring an action for infringement of these rights.
            </p>
            <p className="mb-4">
              Your content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action whether against you or us or a third party.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall HotelsSifnos.com, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, consequential, special, incidental or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your access to or use of or inability to access or use the website</li>
              <li>Any conduct or content of any third party on the website</li>
              <li>Any content obtained from the website</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
              <li>The quality of accommodations or services provided by hotels listed on our website</li>
              <li>Any issues with bookings made through links on our website</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">7. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Greece, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">8. Changes to These Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms of service at any time. If we make changes to these terms, we will post the updated terms on this page and update the "Last updated" date. We encourage you to review these terms regularly.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at:<br />
              Email: <a href="mailto:info@hotelssifnos.com" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">info@hotelssifnos.com</a>
            </p>
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                These Terms of Service were last updated on May 5, 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;
