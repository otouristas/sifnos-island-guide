
import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Link } from 'react-router-dom';

const CookiePolicyPage = () => {
  return (
    <>
      <SEO 
        title="Cookie Policy - HotelsSifnos.com"
        description="Learn about how HotelsSifnos.com uses cookies and similar technologies to enhance your browsing experience."
        keywords={['cookie policy', 'cookies', 'sifnos hotels cookies', 'website cookies']}
        canonical="https://hotelssifnos.com/cookie-policy"
      />
      
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cookie Policy", href: "/cookie-policy" }
          ]}
        />
      
        <h1 className="section-title mb-8">Cookie Policy</h1>
        
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">Last updated: May 5, 2026</p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">1. Introduction</h2>
            <p className="mb-4">
              This Cookie Policy explains what cookies are and how HotelsSifnos.com uses them. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies, and how that information is used. It also describes the options available to you for controlling cookies.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">2. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work efficiently and provide reporting information.
            </p>
            <p className="mb-4">
              Cookies set by the website owner (in this case, HotelsSifnos.com) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (such as advertising, interactive content, and analytics).
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">3. How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Necessary cookies</strong>: These are essential to provide you with services available through our website and to enable you to use some of its features. Without these cookies, the services that you have asked for cannot be provided.</li>
              <li><strong>Analytics cookies</strong>: These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.</li>
              <li><strong>Functionality cookies</strong>: These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.</li>
              <li><strong>Marketing/Advertising cookies</strong>: These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">4. Specific Cookies We Use</h2>
            <p className="mb-4">
              Our website uses both first-party and third-party cookies for a variety of purposes. The specific cookies we use include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>cookiesAccepted</strong>: A first-party cookie that remembers if you've accepted our cookie policy.</li>
              <li><strong>Google Analytics</strong>: Third-party cookies used to collect information about how visitors use our site. We use this information to compile reports and to help us improve the site.</li>
              <li><strong>Booking.com Affiliate Cookies</strong>: Third-party cookies set when you click through to Booking.com from our site. These cookies help Booking.com track referrals from our website.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">5. Your Cookie Choices</h2>
            <p className="mb-4">
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">www.allaboutcookies.org</a>.
            </p>
            <p className="mb-4">
              Please note that disabling cookies may affect the functionality of this and many other websites that you visit. Therefore, it is recommended that you do not disable cookies.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">6. Changes to Our Cookie Policy</h2>
            <p className="mb-4">
              We may update our Cookie Policy from time to time. Any changes will be posted on this page and, where appropriate, notified to you when you visit our website. Please check back frequently to see any updates or changes to our Cookie Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-sifnos-deep-blue mt-6 mb-3">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Cookie Policy, please contact us at:<br />
              Email: <a href="mailto:info@hotelssifnos.com" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">info@hotelssifnos.com</a>
            </p>
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                This Cookie Policy was last updated on May 5, 2026.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                For more information about how we protect your data, please read our <Link to="/privacy-policy" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;
