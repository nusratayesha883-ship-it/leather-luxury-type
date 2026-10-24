import React from 'react';
import { useApp } from '../context/AppContext';

interface BrandNameProps {
  className?: string;
  hideColorClass?: string;
}

export const BrandName: React.FC<BrandNameProps> = ({
  className = '',
  hideColorClass = 'text-[#D4AF37]',
}) => {
  const { language } = useApp();

  if (language === 'BN') {
    return (
      <span className={className}>
        লাক্স<span className={hideColorClass}>হাইড</span> অ্যাটেলিয়ার
      </span>
    );
  }

  return (
    <span className={className}>
      Luxe<span className={hideColorClass}>Hide</span> Atelier
    </span>
  );
};
