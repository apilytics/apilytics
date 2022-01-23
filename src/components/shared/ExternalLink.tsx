import React from 'react';
import type { AnchorHTMLAttributes } from 'react';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const ExternalLink: React.FC<Props> = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noreferrer" {...props}>
    {children}
  </a>
);
