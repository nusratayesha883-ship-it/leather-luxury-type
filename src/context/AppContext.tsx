import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import type { Language, Currency, LeatherItem, CartItem, LeatherColor, LocalizedString, CustomOrderDraft } from '../types';

interface AppContextType {
  // Language & Currency
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  l: (obj: LocalizedString | undefined) => string;

  // Navigation & Routing
  currentPath: string;
  navigateTo: (path: string) => void;

  // Custom Order Draft
  customOrderDraft: CustomOrderDraft;
  updateCustomOrderDraft: (draft: Partial<CustomOrderDraft>) => void;
  proceedToCustomOrder: (leatherId: string, sqft: number, totalUSD: number, totalBDT: number) => void;

  // Cart Management
  cartItems: CartItem[];
  addToCart: (leather: LeatherItem, sqft: number, selectedColor?: LeatherColor) => void;
  removeFromCart: (leatherId: string, colorCode: string) => void;
  updateQuantity: (leatherId: string, colorCode: string, deltaSqft: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  totalSqft: number;
  subtotalUSD: number;
  subtotalBDT: number;

  // UI Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;

  // Search & Navigation
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCustomLeatherId: string;
  setSelectedCustomLeatherId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Pure EN = USD, Pure BN = BDT
  const [language, setLanguageState] = useState<Language>('EN');
  const currency: Currency = language === 'BN' ? 'BDT' : 'USD';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'EN' ? 'BN' : 'EN'));
  };

  const l = (obj: LocalizedString | undefined): string => {
    if (!obj) return '';
    return language === 'BN' ? obj.bn : obj.en;
  };

  // Client Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('custom-order') || p.includes('checkout')) {
        return '/custom-order';
      }
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname.toLowerCase();
        if (p.includes('custom-order') || p.includes('checkout')) {
          setCurrentPath('/custom-order');
        } else {
          setCurrentPath('/');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    const isCustomOrder = path.includes('custom-order') || path.includes('checkout');
    const normalized = isCustomOrder ? '/custom-order' : '/';
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(normalized);
  };

  // Custom Order Draft State
  const [customOrderDraft, setCustomOrderDraft] = useState<CustomOrderDraft>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('luxe_custom_order_draft');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return {
      leatherId: 'full-grain-cowhide',
      sqft: 50,
      totalUSD: 225,
      totalBDT: 27000,
    };
  });

  const updateCustomOrderDraft = (draft: Partial<CustomOrderDraft>) => {
    setCustomOrderDraft(prev => {
      const updated = { ...prev, ...draft };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('luxe_custom_order_draft', JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  const proceedToCustomOrder = (leatherId: string, sqft: number, totalUSD: number, totalBDT: number) => {
    updateCustomOrderDraft({ leatherId, sqft, totalUSD, totalBDT });
    setSelectedCustomLeatherId(leatherId);
    navigateTo('/custom-order');
  };

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomLeatherId, setSelectedCustomLeatherId] = useState('full-grain-cowhide');

  const addToCart = (leather: LeatherItem, sqft: number, color?: LeatherColor) => {
    const selectedColor = color || leather.colors[0];
    const quantity = Math.max(1, sqft || leather.moq);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.leather.id === leather.id && item.selectedColor.code === selectedColor.code
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].sqft += quantity;
        return updated;
      }

      return [...prev, { leather, sqft: quantity, selectedColor }];
    });
  };

  const removeFromCart = (leatherId: string, colorCode: string) => {
    setCartItems(prev =>
      prev.filter(
        item => !(item.leather.id === leatherId && item.selectedColor.code === colorCode)
      )
    );
  };

  const updateQuantity = (leatherId: string, colorCode: string, deltaSqft: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.leather.id === leatherId && item.selectedColor.code === colorCode) {
            const newSqft = item.sqft + deltaSqft;
            return newSqft > 0 ? { ...item, sqft: newSqft } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItemsCount = useMemo(
    () => cartItems.length,
    [cartItems]
  );

  const totalSqft = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.sqft, 0),
    [cartItems]
  );

  const subtotalUSD = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.leather.priceUSD * item.sqft, 0),
    [cartItems]
  );

  const subtotalBDT = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.leather.priceBDT * item.sqft, 0),
    [cartItems]
  );

  return (
    <AppContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        toggleLanguage,
        l,
        currentPath,
        navigateTo,
        customOrderDraft,
        updateCustomOrderDraft,
        proceedToCustomOrder,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        totalSqft,
        subtotalUSD,
        subtotalBDT,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        searchQuery,
        setSearchQuery,
        selectedCustomLeatherId,
        setSelectedCustomLeatherId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
