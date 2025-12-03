'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export function ScrollRestoration() {
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('langToggleScroll');
    if (savedScroll) {
      const pos = parseInt(savedScroll, 10);
      requestAnimationFrame(() => {
        window.scrollTo(0, pos);
        sessionStorage.removeItem('langToggleScroll');
      });
    }
  }, [locale]);

  return null;
}
