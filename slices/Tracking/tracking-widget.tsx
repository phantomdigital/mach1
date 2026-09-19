'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { defaultLocale, type LocaleCode } from '@/prismicio';
import { quoteChrome } from '@/lib/quote-ui';
import { trackingCopy } from '@/lib/tracking-ui';
import { trackPlausible } from '@/lib/plausible';

interface TrackingWidgetProps {
  urlPrefix: string;
  placeholderText?: string;
  inputLabel?: string | null;
  submitButtonText?: string | null;
  warningText?: string | null;
  locale?: LocaleCode;
}

export function TrackingWidget({
  urlPrefix,
  placeholderText,
  inputLabel,
  submitButtonText,
  warningText,
  locale = defaultLocale,
}: TrackingWidgetProps) {
  const copy = trackingCopy(locale);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      trackPlausible('Track Shipment', { source: 'tracking' });
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
          {quoteChrome(inputLabel, copy.trackingNumber, locale)}
        </label>
        <Input
          id="tracking-number"
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder={quoteChrome(placeholderText, copy.placeholder, locale)}
          required
        />
      </div>
      <div className="space-y-3">
        <Button
          type="submit"
          variant="hero"
          className="w-full"
        >
          {quoteChrome(submitButtonText, copy.track, locale)}
        </Button>
        <p className="text-xs text-neutral-400 text-left pt-4">
          {quoteChrome(warningText, copy.warning, locale)}
        </p>
      </div>
    </form>
  );
}

