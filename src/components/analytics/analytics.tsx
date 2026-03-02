import Script from 'next/script';
import { FC } from 'react';

interface IAnalyticsProps {
  trackingId: string;
}
export const Analytics: FC<IAnalyticsProps> = ({ trackingId }) => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${trackingId}')`}
      </Script>
    </>
  );
};
