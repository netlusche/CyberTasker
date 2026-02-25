import { useEffect } from 'react';

export const useFocusTrap = (ref, isActive = true) => {
    useEffect(() => {
        if (!isActive || !ref.current) return;

        // Ensure tabindex elements aren't skipped by our logic unless intended
        const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;

            const focusableElements = ref.current.querySelectorAll(focusableSelector);
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }

            // Convert NodeList to Array and filter out items that are not actually visible/focusable
            const focusableArray = Array.from(focusableElements).filter(el => {
                return el.offsetWidth > 0 && el.offsetHeight > 0 && window.getComputedStyle(el).visibility !== 'hidden';
            });

            if (focusableArray.length === 0) {
                e.preventDefault();
                return;
            }

            const firstElement = focusableArray[0];
            const lastElement = focusableArray[focusableArray.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement || document.activeElement === ref.current || !ref.current.contains(document.activeElement)) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement || !ref.current.contains(document.activeElement)) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        const focusableElements = ref.current.querySelectorAll(focusableSelector);
        const focusableArray = Array.from(focusableElements).filter(el => {
            return el.offsetWidth > 0 && el.offsetHeight > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        });

        if (focusableArray.length > 0) {
            setTimeout(() => {
                if (ref.current) {
                    focusableArray[0].focus();
                }
            }, 10);
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isActive, ref]);
};
