"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputWithUnitProps {
  name: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  label: string;
  required?: boolean;
  placeholder?: string;
  unit?: string;
  unitOptions?: string[];
  onUnitChange?: (unit: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInputWithUnit({
  name,
  value,
  onChange,
  label,
  required,
  placeholder,
  unit,
  unitOptions = [],
  onUnitChange,
  min,
  max,
  step = 1,
}: NumberInputWithUnitProps) {
  const [selectedUnit, setSelectedUnit] = React.useState(unit || unitOptions[0] || "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleIncrement = () => {
    const currentValue = parseFloat(String(value)) || 0;
    const newValue = max !== undefined ? Math.min(currentValue + step, max) : currentValue + step;
    onChange(name, String(newValue));
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(String(value)) || 0;
    const newValue = min !== undefined ? Math.max(currentValue - step, min) : currentValue - step;
    onChange(name, String(newValue));
  };

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    if (onUnitChange) {
      onUnitChange(newUnit);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-neutral-800 text-sm mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="flex items-center gap-1">
        {/* Number input with steppers */}
        <div className="relative flex-1 min-w-0 flex items-center border-b border-neutral-300 pb-2 focus-within:border-neutral-800 transition-colors">
          <input
            ref={inputRef}
            type="number"
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            step={step}
            className="flex-1 min-w-0 bg-transparent text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          
          {/* Stepper buttons */}
          <div className="flex flex-col ml-1 flex-shrink-0">
            <button
              type="button"
              onClick={handleIncrement}
              className="p-0.5 hover:bg-neutral-100 rounded transition-colors text-neutral-600 hover:text-neutral-800"
              aria-label="Increment"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              className="p-0.5 hover:bg-neutral-100 rounded transition-colors text-neutral-600 hover:text-neutral-800"
              aria-label="Decrement"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Unit dropdown */}
        {unitOptions.length > 0 && (
          <div className="relative flex-shrink-0">
            <select
              value={selectedUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="appearance-none bg-transparent border-b border-neutral-300 pb-2 pr-5 pl-1 text-sm text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors cursor-pointer"
            >
              {unitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute right-0 top-0 bottom-2 flex items-center pointer-events-none">
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
        )}
        
        {/* Static unit (no dropdown) */}
        {unitOptions.length === 0 && unit && (
          <span className="text-neutral-600 text-sm border-b border-transparent pb-2 flex-shrink-0">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

