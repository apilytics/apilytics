import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ExternalLink } from 'components/shared/ExternalLink';
import { staticRoutes } from 'utils/router';
import { DESCRIPTION } from 'utils/constants';

export const Footer: React.FC = () => (
  <footer className="footer footer-center bg-base-100">
    <div className="container text-left max-w-3xl py-4 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex">
            <Image
              src="/logo.svg"
              layout="fixed"
              width={50}
              height={40}
              objectFit="contain"
              alt="Logo"
            />
            <h6 className="footer-title text-white ml-2">Apilytics</h6>
          </div>
          <p className="py-2">{DESCRIPTION}</p>
          <p className="text-xs">
            Built by <ExternalLink href="https://github.com/blomqma">@blomqma</ExternalLink> and{' '}
            <ExternalLink href="https://github.com/ruohola">@ruohola</ExternalLink>
          </p>
        </div>
        <div>
          <h6 className="footer-title text-white">Company</h6>
          <ul>
            <p>
              <Link href={staticRoutes.blog}>
                <a>Blog</a>
              </Link>
            </p>
            <p>
              <Link href={staticRoutes.contact}>
                <a>Contact</a>
              </Link>
            </p>
            <p>
              <Link href={staticRoutes.privacy}>
                <a>Privacy</a>
              </Link>
            </p>
            <p>
              <Link href={staticRoutes.about}>
                <a>About</a>
              </Link>
            </p>
          </ul>
        </div>
        <div>
          <h6 className="footer-title text-white">Community</h6>
          <ul>
            <p>
              <ExternalLink href="https://github.com/apilytics">Github</ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://twitter.com/apilytics">Twitter</ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://reddit.com/r/apilytics">Reddit</ExternalLink>
            </p>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
