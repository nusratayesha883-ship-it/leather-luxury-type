import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const Footer: React.FC = () => {
  const { l } = useApp();
  const t = TRANSLATIONS.footer;

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1bnJqC8e7H/',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/ayesha676978?rpxt=MTZicmcwamQ2bXAxZg==',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@li-asahi-su?si=cLGI4Aq9alBkngG5',
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#140D0A] border-t border-[#D4AF37]/20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand Copyright */}
        <div className="text-center sm:text-left">
          <span className="font-heading text-lg font-bold text-[#FDFBF7] block">
            {l(TRANSLATIONS.brand.name)}
          </span>
          <p className="text-xs text-[#A69282] mt-0.5">
            © {new Date().getFullYear()} {l(TRANSLATIONS.brand.name)}. {l(t.rights)} {l(t.tagline)}
          </p>
        </div>

        {/* Center: Admin Portal link & Tannery Certification */}
        <div className="flex items-center gap-4 text-xs text-[#A69282]">
          <a
            href="#/admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-full bg-[#1F1510] hover:bg-[#2D1D16] text-[#D4AF37] hover:text-[#FDFBF7] border border-[#D4AF37]/30 transition-all font-semibold"
            title="Open Atelier Admin Order Dashboard"
          >
            <span>Admin Portal</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E5C365]">Orders</span>
          </a>
        </div>

        {/* Minimalist SVG Social Icons ONLY */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#221711] border border-[#D4AF37]/25 flex items-center justify-center text-[#D4C5B9] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] hover:scale-110 shadow-sm transition-all"
            >
              {social.svg}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};
