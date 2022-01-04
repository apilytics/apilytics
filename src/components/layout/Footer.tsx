import Link from 'next/link';
import React from 'react';

import { staticRoutes } from 'utils/router';

export const Footer: React.FC = () => (
  <footer className="footer footer-center bg-base-300">
    <div className="container py-16">
      <p className="footer-title">© 2021 Apilytics</p>
      <a className="link link-primary" href="mailto:hello@apilytics.io">
        hello@apilytics.io
      </a>
      <a
        className="link link-primary"
        href="https://twitter.com/apilytics"
        target="_blank"
        rel="noreferrer"
      >
        Twitter
      </a>
      <Link href={staticRoutes.privacy}>
        <a className="link link-primary">Privacy</a>
      </Link>
    </div>
  </footer>
);
