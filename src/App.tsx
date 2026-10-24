import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CustomOrderSection } from './components/CustomOrderSection';
import { LeatherCatalog } from './components/LeatherCatalog';
import { CostCalculator } from './components/CostCalculator';
import { CustomOrderPage } from './components/CustomOrderPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { SmoothScroll } from './components/SmoothScroll';
import { AtelierCursor } from './components/AtelierCursor';

const MainContent: React.FC = () => {
  const { currentPath } = useApp();

  return (
    <div className="min-h-screen bg-[#170F0B] text-[#FDFBF7] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#170F0B]">
      
      {/* Custom Luxury Atelier Cursor (Fine pointer desktop devices) */}
      <AtelierCursor />

      {/* 1. Header & Navbar with Language Switcher, Search, Cart & WhatsApp */}
      <Header />

      {/* Main Content: Admin Dashboard OR Dedicated PDP OR Dedicated Custom Order Page OR Home Page */}
      <main className="flex-1">
        {currentPath === '/admin' ? (
          <AdminDashboard />
        ) : currentPath.startsWith('/catalog/') ? (
          <ProductDetailPage />
        ) : currentPath === '/custom-order' ? (
          <CustomOrderPage />
        ) : (
          <>
            {/* 2. Hero Section (Full width, dark texture, dual CTAs) */}
            <Hero />

            {/* 3. 4 Main Order / Customization Form Boxes & Real-Time Sync Summary */}
            <CustomOrderSection />

            {/* 4. 9 High-Level Leather Catalog (Grid, filters, swatches, tiered pricing) */}
            <LeatherCatalog />

            {/* 5. Dynamic Square Footage & Price Calculator with 'Proceed to Order' */}
            <CostCalculator />
          </>
        )}
      </main>

      {/* 6. E-Commerce Essentials: Sliding Cart Drawer */}
      <CartDrawer />

      {/* 7. Checkout Modal */}
      <CheckoutModal />

      {/* 8. Client Portal / Auth Modal */}
      <AuthModal />

      {/* 9. Minimalist Footer */}
      <Footer />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <SmoothScroll>
        <MainContent />
      </SmoothScroll>
    </AppProvider>
  );
};

export default App;
