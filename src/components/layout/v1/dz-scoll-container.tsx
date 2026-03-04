import { ReactNode } from 'react';
import { DzBox } from './dz-box';

import './dz-scoll-container.scss';

export const DzScrollContainer = ({
  vertical,
  scoll = 'auto',
  children,
}: {
  vertical?: boolean;
  scoll?: 'inside' | 'outside' | 'auto';
  children: ReactNode;
}) => (
  <DzBox style={{ position: 'relative', height: '100%' }}>
    <DzBox
      className={`dz-scroll-container scroll-${scoll} ${vertical ? 'verical' : 'horizontal'} `}
    >
      {children}
    </DzBox>
  </DzBox>
);

const Sticky = ({ children }: { children: ReactNode }) => (
  <DzBox className='sticky-content'>{children}</DzBox>
);

const StickyBottom = ({ children }: { children: ReactNode }) => (
  <DzBox className='sticky-bottom-content'>{children}</DzBox>
);

const Scroll = ({ children }: { children: ReactNode }) => (
  <DzBox className='scoll-content'>{children}</DzBox>
);

DzScrollContainer.Sticky = Sticky;
DzScrollContainer.StickyBottom = StickyBottom;
DzScrollContainer.Scroll = Scroll;
