import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { EmailListForm } from 'components/shared/EmailListForm';
import { ExternalLink } from 'components/shared/ExternalLink';
import { staticRoutes } from 'utils/router';
import type { FooterProps } from 'types';

export const Footer: React.FC<FooterProps> = ({ hideEmailList }) => (
  <footer className="footer footer-center bg-base-100">
    <div className="container">
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="flex flex-col text-left py-4 sm:p-4">
          <Image
            src="/logo.svg"
            layout="fixed"
            width={150}
            height={100}
            objectFit="contain"
            alt="Logo"
          />
          <p className="py-2">
            Built by <ExternalLink href="https://github.com/blomqma">@blomqma</ExternalLink> and{' '}
            <ExternalLink href="https://github.com/ruohola">@ruohola</ExternalLink>
          </p>
          {!hideEmailList && <EmailListForm label="Keep me updated" />}
          <h6 className="footer-title mt-4">© {new Date().getFullYear()} Apilytics</h6>
        </div>
        <div className="flex flex-col text-left py-4 sm:p-4">
          <h6 className="footer-title">Product</h6>
          <ul>
            <p>
              <Link href={staticRoutes.docs}>
                <a>Docs</a>
              </Link>
            </p>
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
          </ul>
        </div>
        <div className="flex flex-col text-left py-4 sm:p-4">
          <h6 className="footer-title">Community</h6>
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
