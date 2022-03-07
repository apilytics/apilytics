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
      <div className="card h-60 rounded-lg bg-base-100 p-4 hover:bg-gray-700">
        <h5 className="text-white">{title}</h5>
        <p>{text}</p>
      </div>
    </a>
  </Link>
);
