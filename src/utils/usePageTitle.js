import { useEffect } from 'react';

/**
 * Sets the browser tab title for the current page.
 * @param {string} title - the page-specific part of the title
 */
export function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | BU Grade Computation Portal` : 'BU Grade Computation Portal';
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}