import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ExternalLink } from 'components/shared/ExternalLink';
import { usePlausible } from 'hooks/usePlausible';
import { DEFAULT_MAX_WIDTH, DESCRIPTION } from 'utils/constants';
import { staticRoutes } from 'utils/router';
import type { FooterProps } from 'types';

const FEATURE_LINKS = [
  {
    text: 'Ease of use',
    href: staticRoutes.easeOfUse,
  },
  {
    text: 'Lightweight',
    href: staticRoutes.lightweight,
  },
  {
    text: 'Privacy friendly',
    href: staticRoutes.privacyFriendly,
  },
  {
    text: 'Open source',
    href: staticRoutes.openSource,
  },
];

const RESOURCE_LINKS = [
  {
    text: 'Blog',
    href: staticRoutes.blog,
    component: Link,
  },
  {
    text: 'Docs',
    href: staticRoutes.docs,
    component: Link,
  },
  {
    text: 'Changelog',
    href: staticRoutes.changelog,
    component: Link,
  },
  {
    text: 'Roadmap',
    href: staticRoutes.roadmap,
    component: ExternalLink,
  },
];

const COMMUNITY_LINKS = [
  {
    text: 'GitHub',
    href: staticRoutes.github,
    component: ExternalLink,
  },
  {
    text: 'Twitter',
    href: staticRoutes.twitter,
    component: ExternalLink,
  },
  {
    text: 'Reddit',
    href: staticRoutes.reddit,
    component: ExternalLink,
  },
];

const COMPANY_LINKS = [
  {
    text: 'About',
    href: staticRoutes.about,
  },
  {
    text: 'Contact',
    href: staticRoutes.contact,
  },
  {
    text: 'Privacy policy',
    href: staticRoutes.privacyPolicy,
  },
];

export const Footer: React.FC<FooterProps> = ({ maxWidth = DEFAULT_MAX_WIDTH }) => {
  const plausible = usePlausible();
  const handleClick = (value: string) => (): void => plausible('footer-link-click', { value });

  return (
    <footer className="footer footer-center bg-base-100">
      <div
        className={clsx(
          'container text-left py-4 md:py-8 flex flex-col md:flex-row items-start gap-4 md:gap-12',
          maxWidth,
        )}
      >
        <div className="grow">
          <div className="flex items-center">
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
          <p className="py-2 max-w-64">{DESCRIPTION}</p>
          <p className="text-xs">
            Built by{' '}
            <ExternalLink href="https://github.com/blomqma" onClick={handleClick('@blomqma')}>
              blomqma
            </ExternalLink>{' '}
            and{' '}
            <ExternalLink href="https://github.com/ruohola" onClick={handleClick('@ruohola')}>
              ruohola
            </ExternalLink>
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          <div>
            <h6 className="footer-title text-sm">Features</h6>
            <ul>
              {FEATURE_LINKS.map(({ text, href }) => (
                <p key={text} className="whitespace-nowrap" onClick={handleClick(text)}>
                  <Link href={href}>{text}</Link>
                </p>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-sm">Resources</h6>
            <ul>
              {RESOURCE_LINKS.map(({ text, href, component: Component }) => (
                <p key={text} className="whitespace-nowrap" onClick={handleClick(text)}>
                  <Component href={href}>{text}</Component>
                </p>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-sm">Community</h6>
            <ul>
              {COMMUNITY_LINKS.map(({ text, href, component: Component }) => (
                <p key={text} className="whitespace-nowrap" onClick={handleClick(text)}>
                  <Component href={href}>{text}</Component>
                </p>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-sm">Company</h6>
            <ul>
              {COMPANY_LINKS.map(({ text, href }) => (
                <p key={text} className="whitespace-nowrap" onClick={handleClick(text)}>
                  <Link href={href}>{text}</Link>
                </p>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
