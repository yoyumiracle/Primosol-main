'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../helpers/utils';

export const DropdownContext = createContext({
  isOpen: false,
  toggleDropdown: () => {},
  closeDropdown: () => {},
});

export const DropdownItem = ({ children, onClick, className, disabled }: any) => {
  const { closeDropdown } = useContext(DropdownContext);

  return (
    <div
      onClick={() => {
        if (!disabled) {
          onClick?.();
          closeDropdown();
        }
      }}
      className={cn(className, disabled ? 'opacity-50' : '', 'cursor-pointer px-4 py-1 md:hover:bg-light-gray text-sm')}>
      {children}
    </div>
  );
};

const Dropdown = ({ DropdownButton, DropdownMenu, position = 'left', onToggle, className }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateDropdownPosition = () => {
    if (buttonRef.current && dropdownRef.current) {
      const { bottom, left, right, width } = buttonRef.current.getBoundingClientRect();
      const dropdownStyles = dropdownRef.current.style;

      dropdownStyles.top = `${bottom}px`;
      dropdownStyles.width = 'max-content';

      // Adjusting based on position prop
      if (position === 'left') {
        dropdownStyles.left = `${left + window.scrollX}px`;
        dropdownStyles.right = '';
      } else if (position === 'right') {
        const viewportWidth = document.documentElement.clientWidth;
        dropdownStyles.right = `${viewportWidth - right + window.scrollX}px`;
        dropdownStyles.left = '';
      } else if (position === 'center') {
        dropdownStyles.left = `${left + window.scrollX - (dropdownRef.current.offsetWidth - width) / 2}px`;
        dropdownStyles.right = '';
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        closeDropdown();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onToggle && onToggle(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    onToggle && onToggle(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      default:
        return '';
    }
  };

  const variants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
  };

  return (
    <DropdownContext.Provider value={{ isOpen, toggleDropdown, closeDropdown }}>
      <div ref={buttonRef} className={cn(className, 'relative')}>
        {DropdownButton(toggleDropdown, isOpen)}
      </div>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                animate={isOpen ? 'open' : 'closed'}
                variants={variants}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`inset fixed z-[99] mt-2 rounded bg-opacity-40 py-2 bg-mid-gray backdrop-blur-md border border-outline ${getPositionClasses()}`}
                initial='closed'
                ref={dropdownRef}>
                {DropdownMenu}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      {/* </div> */}
    </DropdownContext.Provider>
  );
};

export default Dropdown;
