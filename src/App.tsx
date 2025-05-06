
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import CacheBuster from './components/CacheBuster';

function App() {
  return (
    <Router>
      <CacheBuster />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;
