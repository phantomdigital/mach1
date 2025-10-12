"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerInputProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  label: string;
}

export default function DatePickerInput({
  name,
  value,
  onChange,
  placeholder,
  required,
  label,
}: DatePickerInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setMonth(selectedDate);
      // Format date as YYYY-MM-DD for form submission
      onChange(name, format(selectedDate, "yyyy-MM-dd"));
      setIsOpen(false);
    } else {
      onChange(name, "");
    }
  };

  return (
    <div className="w-full">
      <label className="block text-neutral-800 text-sm mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full bg-transparent border-b border-neutral-300 pb-2 text-left text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors flex items-center justify-between gap-2"
          >
            <span className={date ? "text-neutral-800" : "text-neutral-400"}>
              {date ? format(date, "PPP") : placeholder || "Select date"}
            </span>
            <CalendarIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 max-w-[calc(100vw-2rem)]" 
          align="center"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />
    </div>
  );
}

