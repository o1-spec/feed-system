import { StateStorage } from 'zustand/middleware';

/**
 * Standard Cookie Manipulation Utilities
 * Dynamically applies Secure parameters depending on protocol to support HTTP local dev
 */

export function setCookie(name: string, value: string, days?: number) {
  if (typeof window === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  
  // Only apply Secure flag on HTTPS connections to prevent browser rejection on http://localhost
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secureFlag}`;
}

export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;
  
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureFlag}`;
}

/**
 * Custom StateStorage backend wrapping our cookies helper for Zustand persist middleware
 */
export const cookieStateStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return getCookie(name);
  },
  setItem: (name: string, value: string): void => {
    setCookie(name, value, 7); // Persist authentication token cookie for 7 days
  },
  removeItem: (name: string): void => {
    deleteCookie(name);
  },
};
