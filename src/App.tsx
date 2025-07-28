import React, { useEffect } from 'react';
import {
  Navigation,
  Hero,
  Features,
  VIPSection,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer
} from './components';
import { addSkipLink } from './utils/accessibility';
import { generateStructuredData } from './utils/seo';

function App() {
  useEffect(() => {
    // Add skip link for accessibility
    addSkipLink();

    // Add structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(generateStructuredData());
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Features />
        <VIPSection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;