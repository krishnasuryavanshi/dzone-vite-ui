/**
 * Shim for `next/link`.
 * Maps Next.js <Link href="..."> to React Router <Link to="...">.
 */
import React, { forwardRef } from 'react';
import { Link as RRLink } from 'react-router-dom';
import type { LinkProps as RRLinkProps } from 'react-router-dom';

interface NextLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string | { pathname?: string; query?: Record<string, string> };
  replace?: boolean;
  prefetch?: boolean;
  scroll?: boolean;
  children?: React.ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ href, replace, children, prefetch, scroll, ...rest }, ref) => {
    let to: string;
    if (typeof href === 'string') {
      to = href;
    } else {
      const params = href.query
        ? '?' + new URLSearchParams(href.query).toString()
        : '';
      to = (href.pathname || '') + params;
    }

    return (
      <RRLink ref={ref} to={to} replace={replace} {...rest}>
        {children}
      </RRLink>
    );
  },
);

Link.displayName = 'Link';

export default Link;
export { Link };
