import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const AtelierCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isNativeInput, setIsNativeInput] = useState<boolean>(false);
  const [isPointerDevice, setIsPointerDevice] = useState<boolean>(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Damped spring physics for smooth outer trailing ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only activate custom cursor on fine pointer devices (desktops/laptops with mouse/trackpad)
    const checkPointer = () => {
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      setIsPointerDevice(finePointer);
      if (finePointer) {
        document.body.classList.add('atelier-cursor-active');
      } else {
        document.body.classList.remove('atelier-cursor-active');
      }
    };

    checkPointer();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over native inputs (range slider, text fields)
      const target = e.target as HTMLElement | null;
      if (target) {
        const isSlider = Boolean(
          target.closest('input[type="range"]') || (target instanceof HTMLInputElement && target.type === 'range')
        );
        const isTextInput = Boolean(
          target.closest('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea')
        );

        if (isSlider || isTextInput) {
          setIsNativeInput(true);
          setIsHovered(false);
          return;
        }

        setIsNativeInput(false);

        // Check if hovering over interactive clickable elements
        const isClickable = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('select') ||
          target.closest('.luxury-card') ||
          target.closest('.interactive-clickable') ||
          target.closest('.swatch-card')
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('atelier-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isPointerDevice || !isVisible) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-9999 overflow-hidden transition-opacity duration-150 ${isNativeInput ? 'opacity-0' : 'opacity-100'}`}>
      {/* 1. Outer Ambient Trailing Ring with gold blur expansion on hover */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full border border-[#D4AF37] pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 54 : 30,
          height: isHovered ? 54 : 30,
          backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.12)' : 'rgba(212, 175, 55, 0.03)',
          borderColor: isHovered ? 'rgba(229, 195, 101, 0.7)' : 'rgba(212, 175, 55, 0.35)',
          boxShadow: isHovered
            ? '0 0 24px rgba(212, 175, 55, 0.4), inset 0 0 14px rgba(212, 175, 55, 0.2)'
            : '0 0 8px rgba(212, 175, 55, 0.15)',
          backdropFilter: isHovered ? 'blur(1.5px)' : 'none',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 400,
          mass: 0.4,
        }}
      />

      {/* 2. Inner Pinpoint Gold Dot following exact cursor coordinates */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none bg-[#E5C365]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 6 : 4,
          height: isHovered ? 6 : 4,
          backgroundColor: isHovered ? '#FFFFFF' : '#E5C365',
          boxShadow: isHovered
            ? '0 0 10px #FFFFFF, 0 0 16px #D4AF37'
            : '0 0 6px #E5C365',
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};
