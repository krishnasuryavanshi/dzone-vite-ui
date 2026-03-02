import Script from 'next/script';
import { FC } from 'react';
interface IAnalyticsProps {
  clarityId: string;
}
export const ClarityAnalytics: FC<IAnalyticsProps> = ({ clarityId }) => {
  return (
    <>
      <Script id='clarity-script' strategy='afterInteractive'>
        {`(function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");`}
      </Script>
    </>
  );
};
