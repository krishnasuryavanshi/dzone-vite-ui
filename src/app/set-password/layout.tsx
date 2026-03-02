import React, { PropsWithChildren } from 'react';
import { DzBox } from '@/components/layout/v1';

export default function PageLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return <DzBox>{children}</DzBox>;
}
