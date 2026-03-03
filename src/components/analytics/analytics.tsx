import { FC, useEffect } from 'react';

interface IAnalyticsProps {
  trackingId: string;
}
export const Analytics: FC<IAnalyticsProps> = ({ trackingId }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.async = true;
    document.head.appendChild(script);

    const initScript = document.createElement('script');
    initScript.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${trackingId}')`;
    document.head.appendChild(initScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(initScript);
    };
  }, [trackingId]);

  return null;
};
