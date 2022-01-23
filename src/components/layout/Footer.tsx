import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ExternalLink } from 'components/shared/ExternalLink';
import { DESCRIPTION } from 'utils/constants';
import { staticRoutes } from 'utils/router';

export const Footer: React.FC = () => (
  <footer className="footer footer-center bg-base-100">
    <div className="container text-left max-w-3xl py-4 md:py-8 flex flex-col md:flex-row items-start">
      <div className="max-w-sm md:pr-12">
        <div className="flex">
          <Image
            src="/logo.svg"
            layout="fixed"
            width={60}
            height={40}
            objectFit="contain"
            alt="Logo"
          />
          <h6 className="ml-2">Apilytics</h6>
        </div>
        <p className="py-2">{DESCRIPTION}</p>
        <p className="text-xs">
          Built by <ExternalLink href="https://github.com/blomqma">@blomqma</ExternalLink> and{' '}
          <ExternalLink href="https://github.com/ruohola">@ruohola</ExternalLink>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div>
          <h6 className="footer-title text-sm text-white">Why Apilytics?</h6>
          <ul>
            <p>
              <Link href={staticRoutes.easeOfUse}>Ease of Use</Link>
            </p>
            <p>
              <Link href={staticRoutes.lightweight}>Lightweight</Link>
            </p>
            <p>
              <Link href={staticRoutes.privacyFriendly}>Privacy Friendly</Link>
            </p>
            <p>
              <Link href={staticRoutes.openSource}>Open Source</Link>
            </p>
          </ul>
        </div>
        <div>
          <h6 className="footer-title text-sm text-white">Community</h6>
          <ul>
            <p>
              <Link href={staticRoutes.blog}>Blog</Link>
            </p>
            <p>
              <Link href={staticRoutes.docs}>Docs</Link>
            </p>
            <p>
              <ExternalLink href={staticRoutes.github}>Github</ExternalLink>
            </p>
            <p>
              <ExternalLink href={staticRoutes.twitter}>Twitter</ExternalLink>
            </p>
            <p>
              <ExternalLink href={staticRoutes.reddit}>Reddit</ExternalLink>
            </p>
          </ul>
        </div>
        <div>
          <h6 className="footer-title text-sm text-white">Company</h6>
          <ul>
            <p>
              <Link href={staticRoutes.about}>About</Link>
            </p>
            <p>
              <Link href={staticRoutes.contact}>Contact</Link>
            </p>
            <p>
              <Link href={staticRoutes.privacyPolicy}>Privacy Policy</Link>
            </p>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
