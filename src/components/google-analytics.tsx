'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-0NVCC4PVT1';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (pathname && window.gtag) {
      // Send pageview with updated path
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Add this type for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      trackingId: string,
      config?: {
        page_path?: string;
        [key: string]: string | number | boolean | null | undefined;
      }
    ) => void;
    dataLayer: Array<Record<string, unknown>>;
  }
}
