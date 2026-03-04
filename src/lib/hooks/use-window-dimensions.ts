import { debounce } from 'lodash';
import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
  return {
    screenWidth,
    screenHeight,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    const debouncedGetWindowDimensions = debounce(handleResize, 300);

    window.addEventListener('resize', debouncedGetWindowDimensions);
    return () => window.removeEventListener('resize', debouncedGetWindowDimensions);
  }, []);

  return windowDimensions;
}
