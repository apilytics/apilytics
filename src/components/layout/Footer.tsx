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
    text: 'Easy to use',
    href: staticRoutes.easyToUse,
  },
  {
    text: 'Lightweight',
    href: staticRoutes.lightweight,
  },
  {
    text: 'Privacy-friendly',
    href: staticRoutes.privacyFriendly,
  },
  {
    text: 'Open source',
    href: staticRoutes.openSource,
  },
];

const PRODUCT_LINKS = [
  {
    text: 'Docs',
    href: staticRoutes.docs,
    component: Link,
  },
  {
    text: 'Blog',
    href: staticRoutes.blog,
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
  {
    text: 'Terms',
    href: staticRoutes.terms,
  },
];

const PLATFORM_LINKS = [
  {
    text: 'Next.js',
    href: staticRoutes.forNextJS,
  },
  {
    text: 'Express.js',
    href: staticRoutes.forExpress,
  },
  {
    text: 'Django',
    href: staticRoutes.forDjango,
  },
  {
    text: 'FastAPI',
    href: staticRoutes.forFastAPI,
  },
];

const USE_CASE_LINKS = [
  {
    text: 'Serverless',
    href: staticRoutes.forServerless,
  },
  {
    text: 'Microservices',
    href: staticRoutes.forMicroServices,
  },
  {
    text: 'Mobile apps',
    href: staticRoutes.forMobileApps,
  },
  {
    text: 'Startups',
    href: staticRoutes.forStartups,
  },
  {
    text: 'Consultants',
    href: staticRoutes.forConsultants,
  },
];

export const Footer: React.FC<FooterProps> = ({ maxWidth = DEFAULT_MAX_WIDTH }) => {
  const plausible = usePlausible();
  const handleClick = (value: string) => (): void => plausible('footer-link-click', { value });

  return (
    <footer className="footer footer-center bg-base-100">
      <div
        className={clsx(
          'container flex flex-col items-start gap-4 py-4 text-left md:flex-row md:gap-12 md:py-8',
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
            <h6 className="footer-title ml-2 text-sm">Apilytics</h6>
          </div>
          <p className="max-w-64 py-2">{DESCRIPTION}</p>
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
          <div>
            <h6 className="footer-title text-sm">Product</h6>
            <ul>
              {PRODUCT_LINKS.map(({ text, href }) => (
                <p key={text} className="whitespace-nowrap" onClick={handleClick(text)}>
                  <Link href={href}>{text}</Link>
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
            <h6 className="footer-title text-sm">Use cases</h6>
            <ul>
              {USE_CASE_LINKS.map(({ text, href }) => (
                <p key={text} className="whitespace-nowrap" onClick={handleClick(text)}>
                  <Link href={href}>{text}</Link>
                </p>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-sm">Platforms</h6>
            <ul>
              {PLATFORM_LINKS.map(({ text, href }) => (
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
