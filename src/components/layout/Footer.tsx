import Link from 'next/link';
import React from 'react';

import { staticRoutes } from 'utils/router';

export const Footer: React.FC = () => (
  <footer className="footer footer-center bg-base-100">
    <div className="container py-16">
      <p className="footer-title">© 2021 Apilytics</p>
      <Link href={staticRoutes.docs}>
        <a>Docs</a>
      </Link>
      <a href="mailto:hello@apilytics.io">hello@apilytics.io</a>
      <a href="https://twitter.com/apilytics" target="_blank" rel="noreferrer">
        Twitter
      </a>
      <a href="https://github.com/apilytics" target="_blank" rel="noreferrer">
        Open Source
      </a>
      <Link href={staticRoutes.privacy}>
        <a>Privacy</a>
      </Link>
    </div>
  </footer>
);
