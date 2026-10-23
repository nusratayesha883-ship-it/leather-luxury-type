import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Language, Currency, LeatherItem, CartItem, LeatherColor, LocalizedString } from '../types';

interface AppContextType {
  // Language & Currency
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  l: (obj: LocalizedString | undefined) => string;

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
