import React from 'react';

interface Props {
  href: string;
}

export const ExternalLink: React.FC<Props> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);
