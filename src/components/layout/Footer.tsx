import Link from 'next/link';
import React from 'react';

import { staticRoutes } from 'utils/router';

export const Footer: React.FC = () => (
  <footer className="text-center">
    <div className="container py-16 text-secondary mx-auto">
      <p>© 2021 Apilytics</p>
      <p>
        <a href="mailto:hello@apilytics.io">hello@apilytics.io</a>
      </p>
      <p>
        <a href="https://twitter.com/apilytics" target="_blank" rel="noreferrer">
          Twitter
        </a>
      </p>
      <p>
        <Link href={staticRoutes.privacy}>
          <a>Privacy</a>
        </Link>
      </p>
    </div>
  </footer>
);
