'use client';

import { useState, useEffect } from 'react';
import { PrismicNextLink } from "@prismicio/next";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroButton } from "@/components/ui/hero-button";
import Image from "next/image";
import { MobileLanguageSelector } from "./mobile-language-selector";
import type { HeaderDocument, HeaderDocumentDataNavigationItem } from "@/types.generated";

interface MobileMenuProps {
  navigation: HeaderDocument["data"]["navigation"];
  buttons: HeaderDocument["data"]["buttons"];
  subheaderItems?: HeaderDocument["data"]["subheader_items"];
}

export function MobileMenu({ navigation, buttons, subheaderItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setOpenDropdownIndex(null); // Reset dropdowns when closing menu
    }
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <>
      {/* Hamburger/Close Button - instant swap */}
      <button 
        onClick={toggleMenu}
        className="xl:hidden flex items-center justify-center w-10 h-10 text-black"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="w-7 h-7 relative">
          {isOpen ? (
            <Image
              src="/icons/Close.svg"
              alt="Close"
              fill
              className="object-contain"
            />
          ) : (
            <Image
              src="/icons/Hamburger.svg"
              alt="Menu"
              fill
              className="object-contain"
            />
          )}
        </div>
      </button>

      {/* Mobile Menu Panel - Slides up to meet header */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-transparent z-10 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
            />
            
            {/* Menu Panel */}
            <motion.div 
              className="fixed left-0 right-0 bottom-0 bg-neutral-50 z-40 xl:hidden overflow-hidden border-t-2 border-gray-200"
              style={{ 
                top: 'var(--header-height, 80px)'
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {/* Menu Content - Scrollable container */}
            <div 
              className="px-6 py-6 flex flex-col h-full overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Action Buttons - Top Priority */}
              {buttons && buttons.length > 0 && (
                <motion.div 
                  className="space-y-3 mb-6 pb-6 border-b border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {buttons.map((button, index) => (
                    <div key={index} className="w-full">
                      <HeroButton asChild>
                        <PrismicNextLink
                          field={button.link}
                          className="w-full flex justify-center"
                          onClick={toggleMenu}
                        >
                          {button.label}
                        </PrismicNextLink>
                      </HeroButton>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Main Navigation Items */}
              {navigation && navigation.length > 0 && (
                <nav className="space-y-2 mb-6">
                  {navigation.map((item: HeaderDocumentDataNavigationItem, index: number) => {
                    const hasDropdown = item.has_dropdown && item.dropdown_items && item.dropdown_items.length > 0;
                    const isDropdownOpen = openDropdownIndex === index;

                    if (!hasDropdown) {
                      // Simple navigation item
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (index * 0.05) }}
                        >
                          <PrismicNextLink
                            field={item.link}
                            className="block py-3 px-4 text-black font-semibold text-lg hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={toggleMenu}
                          >
                            {item.label}
                          </PrismicNextLink>
                        </motion.div>
                      );
                    }

                    // Navigation item with dropdown
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (index * 0.05) }}
                      >
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="flex items-center justify-between w-full py-3 px-4 text-black font-semibold text-lg hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span>{item.label}</span>
                          <motion.div
                            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </motion.div>
                        </button>

                        {/* Dropdown Items with AnimatePresence */}
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ 
                                height: "auto", 
                                opacity: 1,
                                transition: {
                                  height: {
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1]
                                  },
                                  opacity: {
                                    duration: 0.25,
                                    delay: 0.05
                                  }
                                }
                              }}
                              exit={{ 
                                height: 0, 
                                opacity: 0,
                                transition: {
                                  height: {
                                    duration: 0.25,
                                    ease: [0.4, 0, 0.2, 1]
                                  },
                                  opacity: {
                                    duration: 0.2
                                  }
                                }
                              }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                                {item.dropdown_items?.map((dropdownItem, dropdownIndex) => (
                                  <motion.div
                                    key={dropdownIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ 
                                      opacity: 1, 
                                      x: 0,
                                      transition: {
                                        delay: dropdownIndex * 0.05
                                      }
                                    }}
                                    exit={{ opacity: 0, x: -10 }}
                                  >
                                    <PrismicNextLink
                                      field={dropdownItem.link}
                                      className="block py-2 px-3 text-gray-700 font-medium hover:text-black hover:bg-gray-50 rounded transition-colors"
                                      onClick={toggleMenu}
                                    >
                                      {dropdownItem.label}
                                    </PrismicNextLink>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </nav>
              )}

              {/* Language Selector */}
              <motion.div 
                className="pt-6 pb-4 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <MobileLanguageSelector onLocaleChange={() => toggleMenu()} />
              </motion.div>

              {/* Utility Links (Sub-header) - Bottom */}
              {subheaderItems && subheaderItems.length > 0 && (
                <motion.div 
                  className="pt-4 pb-2 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {subheaderItems.map((item, index) => (
                      <PrismicNextLink
                        key={index}
                        field={item.link}
                        className="text-xs text-gray-600 hover:text-dark-blue transition-colors font-medium"
                        onClick={toggleMenu}
                      >
                        {item.label}
                      </PrismicNextLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
              
              {/* Safe area padding for iOS */}
              <div className="h-[env(safe-area-inset-bottom)]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

