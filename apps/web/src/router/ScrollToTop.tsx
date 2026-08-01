import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window (for full-page layouts)
    window.scrollTo(0, 0);

    // Also scroll the main content area (for DashboardLayout with overflow-y-auto)
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
