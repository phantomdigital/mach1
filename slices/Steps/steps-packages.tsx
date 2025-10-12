"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NumberInputWithUnit } from "@/components/ui/number-input-with-unit";
import AddressAutocompleteInput from "./address-autocomplete-input";

interface Package {
  id: string;
  description: string;
  origin: string;
  destination: string;
  weight: string;
  weightUnit: string;
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
  quantity: string;
}

interface StepsPackagesProps {
  packagesHeading: string;
  selectedCard?: string;
  onSubmit: (packages: Package[]) => void;
}

export default function StepsPackages({
  packagesHeading,
  selectedCard,
  onSubmit,
}: StepsPackagesProps) {
  // Determine country filter based on selected card
  const getCountryFilter = () => {
    if (!selectedCard) return undefined;
    
    const cardLower = selectedCard.toLowerCase();
    
    // Check if it's Australia-specific
    if (cardLower.includes('australia') || cardLower.includes('domestic') || cardLower.includes('local')) {
      return 'AU';
    }
    
    // International means no filter (all countries)
    return undefined;
  };
  
  const countryFilter = getCountryFilter();
  const [packages, setPackages] = useState<Package[]>([
    {
      id: "1",
      description: "",
      origin: "",
      destination: "",
      weight: "",
      weightUnit: "kg",
      length: "",
      width: "",
      height: "",
      dimensionUnit: "mm",
      quantity: "1",
    },
  ]);
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(
    new Set(["1"])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent scrolling during submission
  useEffect(() => {
    if (isSubmitting) {
      // Prevent scrolling on both body and html
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scrolling and position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isSubmitting]);

  const togglePackage = (id: string) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPackages(newExpanded);
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      description: "",
      origin: "",
      destination: "",
      weight: "",
      weightUnit: "kg",
      length: "",
      width: "",
      height: "",
      dimensionUnit: "mm",
      quantity: "1",
    };
    setPackages([...packages, newPackage]);
    // Auto-expand the new package
    setExpandedPackages(new Set([...expandedPackages, newPackage.id]));
  };

  const removePackage = (id: string) => {
    if (packages.length > 1) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
      const newExpanded = new Set(expandedPackages);
      newExpanded.delete(id);
      setExpandedPackages(newExpanded);
    }
  };

  const updatePackage = (id: string, field: keyof Package, value: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
     onSubmit(packages);
    // Note: navigation happens in parent, so we don't need to reset isSubmitting
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      {/* Heading */}
      {packagesHeading && (
        <div className="mb-8">
          <h5 className="text-neutral-800 text-sm">{packagesHeading}</h5>
        </div>
      )}

      {/* Packages List */}
      <AnimatePresence mode="popLayout">
        {packages.map((pkg, index) => {
          const isExpanded = expandedPackages.has(pkg.id);
          const hasData = pkg.description || pkg.origin || pkg.destination || pkg.weight || pkg.length || pkg.width || pkg.height;
          
          return (
            <motion.div
              key={pkg.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`border transition-all overflow-hidden mb-4 ${
                isExpanded 
                  ? 'border-dark-blue/10 bg-white' 
                  : 'border-neutral-200 bg-white'
              }`}
            >
              {/* Package Header - Always Visible with neutral-50 background */}
              <motion.div 
                className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50 transition-colors"
                onClick={() => togglePackage(pkg.id)}
                whileHover={{ backgroundColor: 'rgb(245, 245, 245)' }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <motion.h6 
                    className={`font-medium transition-colors ${isExpanded ? 'text-dark-blue' : 'text-neutral-800'}`}
                    animate={{ color: isExpanded ? '#141433' : '#262626' }}
                    transition={{ duration: 0.2 }}
                  >
                    Package {index + 1}
                  </motion.h6>
                  <AnimatePresence mode="wait">
                    {hasData && !isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-neutral-500"
                      >
                        {pkg.description && `${pkg.description.substring(0, 30)}${pkg.description.length > 30 ? '...' : ''}`}
                        {pkg.origin && pkg.destination && ` • ${pkg.origin.substring(0, 20)} → ${pkg.destination.substring(0, 20)}`}
                        {pkg.weight && ` • ${pkg.weight}${pkg.weightUnit}`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                  {packages.length > 1 && (
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePackage(pkg.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                      aria-label="Remove package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`p-1 ${isExpanded ? 'text-dark-blue' : 'text-neutral-400'}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Package Fields - Collapsible */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: "auto", 
                      opacity: 1,
                      transition: {
                        height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                        opacity: { duration: 0.3, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                        opacity: { duration: 0.2 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-6 pt-6 border-t border-neutral-200 space-y-6">
              {/* Description */}
              <div className="w-full">
                <label className="block text-neutral-800 text-sm mb-2">
                  What are you shipping? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pkg.description}
                  onChange={(e) =>
                    updatePackage(pkg.id, "description", e.target.value)
                  }
                  placeholder="Enter what you are shipping..."
                  required
                  className="w-full bg-transparent border-b border-neutral-300 pb-2 text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-2 gap-8">
                <AddressAutocompleteInput
                  name={`origin-${pkg.id}`}
                  value={pkg.origin}
                  onChange={(_, value) => updatePackage(pkg.id, "origin", value)}
                  placeholder="Enter pickup address..."
                  required
                  label="Pickup Address"
                  country={countryFilter}
                />
                <AddressAutocompleteInput
                  name={`destination-${pkg.id}`}
                  value={pkg.destination}
                  onChange={(_, value) => updatePackage(pkg.id, "destination", value)}
                  placeholder="Enter delivery address..."
                  required
                  label="Delivery Address"
                  country={countryFilter}
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Weight & Quantity */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <NumberInputWithUnit
                        name={`weight-${pkg.id}`}
                        value={pkg.weight}
                        onChange={(_, value) =>
                          updatePackage(pkg.id, "weight", value)
                        }
                        label="Weight"
                        required
                        placeholder="1"
                        unit={pkg.weightUnit}
                        unitOptions={["kg", "lbs", "ton"]}
                        onUnitChange={(unit) =>
                          updatePackage(pkg.id, "weightUnit", unit)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <NumberInputWithUnit
                        name={`quantity-${pkg.id}`}
                        value={pkg.quantity}
                        onChange={(_, value) =>
                          updatePackage(pkg.id, "quantity", value)
                        }
                        label="Quantity"
                        required
                        placeholder="1"
                        unitOptions={["box", "pallet", "container"]}
                        onUnitChange={() => {}}
                      />
                    </div>
                  </div>

                  {/* Length */}
                  <NumberInputWithUnit
                    name={`length-${pkg.id}`}
                    value={pkg.length}
                    onChange={(_, value) =>
                      updatePackage(pkg.id, "length", value)
                    }
                    label="Length"
                    required
                    placeholder="2200"
                    unit={pkg.dimensionUnit}
                    unitOptions={["mm", "cm", "m", "in", "ft"]}
                    onUnitChange={(unit) =>
                      updatePackage(pkg.id, "dimensionUnit", unit)
                    }
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Width */}
                  <NumberInputWithUnit
                    name={`width-${pkg.id}`}
                    value={pkg.width}
                    onChange={(_, value) =>
                      updatePackage(pkg.id, "width", value)
                    }
                    label="Width"
                    required
                    placeholder="2200"
                    unit={pkg.dimensionUnit}
                    unitOptions={["mm", "cm", "m", "in", "ft"]}
                    onUnitChange={(unit) =>
                      updatePackage(pkg.id, "dimensionUnit", unit)
                    }
                  />

                  {/* Height */}
                  <NumberInputWithUnit
                    name={`height-${pkg.id}`}
                    value={pkg.height}
                    onChange={(_, value) =>
                      updatePackage(pkg.id, "height", value)
                    }
                    label="Height"
                    required
                    placeholder="2200"
                    unit={pkg.dimensionUnit}
                    unitOptions={["mm", "cm", "m", "in", "ft"]}
                    onUnitChange={(unit) =>
                      updatePackage(pkg.id, "dimensionUnit", unit)
                    }
                  />
                </div>
              </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add Package Button */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          type="button"
          onClick={addPackage}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-dark-blue hover:text-dark-blue/80 transition-colors text-sm font-medium cursor-pointer hover:underline"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-4 h-4" />
          </motion.div>
          Add Another Package
        </motion.button>
      </motion.div>

      {/* Submit Button */}
      <div className="mt-12 flex justify-center gap-4">
        <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
          {isSubmitting ? "SUBMITTING..." : "CONTINUE"}
        </Button>
        
        {/* Development Skip Button */}
        {process.env.NODE_ENV === "development" && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="px-8"
            onClick={() => onSubmit([])}
            disabled={isSubmitting}
          >
            SKIP (DEV)
          </Button>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overscrollBehavior: 'none',
              touchAction: 'none'
            }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-dark-blue animate-spin mx-auto mb-4" />
              <p className="text-neutral-800 font-medium">Processing your quote request...</p>
              <p className="text-neutral-500 text-sm mt-2">Please wait while we send your request...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

