'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';

interface TrackingWidgetProps {
  urlPrefix: string;
  placeholderText?: string;
}

export function TrackingWidget({ urlPrefix, placeholderText }: TrackingWidgetProps) {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      // Open Logixboard search in a new tab
      window.open(
        `https://${urlPrefix}.logixboard.com/search?term=${encodeURIComponent(trackingNumber.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="tracking-number" className="block text-sm text-neutral-900 mb-2 font-medium">
          Tracking number
        </label>
        <Input
          id="tracking-number"
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder={placeholderText || 'Enter tracking number...'}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-all duration-200 uppercase text-sm tracking-wider"
      >
        Track
      </button>
    </form>
  );
}

