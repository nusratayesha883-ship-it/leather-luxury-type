import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { LeatherCatalog } from './components/LeatherCatalog';
import { CustomServiceForm } from './components/CustomServiceForm';
import { CostCalculator } from './components/CostCalculator';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FAF6F1] text-[#231F20] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#231F20]">
        
        {/* 1. Header & Navbar with Language Switcher, Search, Cart & WhatsApp */}
        <Header />

        {/* Main Content Sections in Order */}
        <main className="flex-1">
          {/* 2. Hero Section (Full width, 60% screen height, dark texture, dual CTAs) */}
          <Hero />

          {/* 3. Trust Badges (4-item strip) */}
          <TrustBadges />

          {/* 4. 9 High-Level Leather Catalog (Grid, filters, swatches, tiered pricing, buttons) */}
          <LeatherCatalog />

          {/* 5. Custom Service & Atelier Form (Pre-filled WhatsApp message) */}
          <CustomServiceForm />

          {/* 6. Dynamic Cost & Margin Calculator (Interactive sliders & outputs) */}
          <CostCalculator />
        </main>

        {/* 7. E-Commerce Essentials: Sliding Cart Drawer (with MOQ warning) */}
        <CartDrawer />

        {/* 8. Checkout Modal (COD, bKash/Nagad mock, Stripe mock) */}
        <CheckoutModal />

        {/* 9. Client Portal / Auth Modal */}
        <AuthModal />

        {/* 10. Minimalist Footer with SVG Social Icons ONLY */}
        <Footer />

      </div>
    </AppProvider>
  );
};

export default App;
