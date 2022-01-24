import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ExternalLink } from 'components/shared/ExternalLink';
import { usePlausible } from 'hooks/usePlausible';
import { DESCRIPTION } from 'utils/constants';
import { staticRoutes } from 'utils/router';

const WHY_LINKS = [
  {
    text: 'Ease of Use',
    href: staticRoutes.easeOfUse,
  },
  {
    text: 'Lightweight',
    href: staticRoutes.lightweight,
  },
  {
    text: 'Privacy Friendly',
    href: staticRoutes.privacyFriendly,
  },
  {
    text: 'Open Source',
    href: staticRoutes.openSource,
  },
];

const COMMUNITY_LINKS = [
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
    text: 'Privacy Policy',
    href: staticRoutes.privacyPolicy,
  },
];

export const Footer: React.FC = () => {
  const plausible = usePlausible();
  const handleClick = (value: string) => (): void => plausible('footer-link-click', { value });

  return (
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
            Built by{' '}
            <ExternalLink href="https://github.com/blomqma">
              <a onClick={handleClick('@blomqma')}>@blomqma</a>
            </ExternalLink>{' '}
            and{' '}
            <ExternalLink href="https://github.com/ruohola">
              <a onClick={handleClick('@blomqma')}>@ruohola</a>
            </ExternalLink>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div>
            <h6 className="footer-title text-sm text-white">Why Apilytics?</h6>
            <ul>
              {WHY_LINKS.map(({ text, href }) => (
                <p key={text}>
                  <Link href={href}>
                    <a onClick={handleClick(text)}>{text}</a>
                  </Link>
                </p>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-sm text-white">Community</h6>
            <ul>
              {COMMUNITY_LINKS.map(({ text, href, component: Component }) => (
                <p key={text}>
                  <Component href={href}>
                    <a onClick={handleClick(text)}>{text}</a>
                  </Component>
                </p>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="footer-title text-sm text-white">Company</h6>
            <ul>
              {COMPANY_LINKS.map(({ text, href }) => (
                <p key={text}>
                  <Link href={href}>
                    <a onClick={handleClick(text)}>{text}</a>
                  </Link>
                </p>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
