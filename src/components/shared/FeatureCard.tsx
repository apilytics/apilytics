import Link from 'next/link';
import React from 'react';

interface Props {
  title: string;
  href: string;
  text: string;
}

export const FeatureCard: React.FC<Props> = ({ title, href, text }) => (
  <Link href={href}>
    <a className="unstyled">
      <div className="bg-base-100 hover:bg-gray-700 card rounded-lg p-4 h-full">
        <h5 className="text-white">{title}</h5>
        <p>{text}</p>
      </div>
    </a>
  </Link>
);
