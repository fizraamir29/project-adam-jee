import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, observerOptions);

    // Watch for target classes
    const observeExisting = () => {
      const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .blur-to-sharp');
      elements.forEach((el) => observer.observe(el));
    };

    observeExisting();

    // MutationObserver to capture elements rendered after initial mount
    const mutationObserver = new MutationObserver(() => {
      observeExisting();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
}
