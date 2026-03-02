/**
 * Shim for `next/font/google`.
 * Fonts are loaded via <link> in index.html instead.
 * Returns an object with className for compatibility.
 */

interface FontConfig {
  weight?: string[];
  style?: string[];
  subsets?: string[];
  display?: string;
}

export function Roboto(_config?: FontConfig) {
  return {
    className: 'font-roboto',
    style: { fontFamily: "'Roboto', sans-serif" },
  };
}

export function Inter(_config?: FontConfig) {
  return {
    className: 'font-inter',
    style: { fontFamily: "'Inter', sans-serif" },
  };
}

// Generic default export for any font
export default function GoogleFont(_config?: FontConfig) {
  return {
    className: '',
    style: { fontFamily: "'Roboto', sans-serif" },
  };
}
