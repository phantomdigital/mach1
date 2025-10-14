'use client';

import { useState, useEffect } from 'react';
import { PrismicNextLink } from "@prismicio/next";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroButton } from "@/components/ui/hero-button";
import type { HeaderDocument, HeaderDocumentDataNavigationItem } from "@/types.generated";

interface MobileMenuProps {
  navigation: HeaderDocument["data"]["navigation"];
  buttons: HeaderDocument["data"]["buttons"];
}

export function MobileMenu({ navigation, buttons }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
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
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-black"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.svg
              key="menu"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring",
              damping: 30,
              stiffness: 300
            }}
          >
            {/* Menu Header */}
            <motion.div 
              className="flex items-center justify-between p-6 border-b border-gray-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-black">Menu</h2>
              <button 
                onClick={toggleMenu}
                className="flex items-center justify-center w-8 h-8 text-black hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Menu Content */}
            <div className="p-6">
              {/* Navigation Items */}
              {navigation && navigation.length > 0 && (
                <nav className="space-y-2 mb-8">
                  {navigation.map((item: HeaderDocumentDataNavigationItem, index: number) => {
                    const hasDropdown = item.has_dropdown && item.dropdown_items && item.dropdown_items.length > 0;
                    const isDropdownOpen = openDropdownIndex === index;

                    if (!hasDropdown) {
                      // Simple navigation item
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (index * 0.05) }}
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (index * 0.05) }}
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

              {/* Action Buttons */}
              {buttons && buttons.length > 0 && (
                <motion.div 
                  className="space-y-3 pt-4 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (navigation?.length || 0) * 0.05 }}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

