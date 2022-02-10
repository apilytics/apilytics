import {
  ChartBarIcon,
  ChevronDownIcon,
  CodeIcon,
  DocumentSearchIcon,
  DotsVerticalIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  MapIcon,
  RssIcon,
  ShieldCheckIcon,
} from '@heroicons/react/solid';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from 'components/shared/Button';
import { useAccount } from 'hooks/useAccount';
import { usePlausible } from 'hooks/usePlausible';
import { DEFAULT_MAX_WIDTH, EVENT_LOCATIONS } from 'utils/constants';
import { truncateString } from 'utils/helpers';
import { staticRoutes } from 'utils/router';
import type { HeaderProps } from 'types';

const WHY_ITEMS = [
  {
    icon: ChartBarIcon,
    href: staticRoutes.easeOfUse,
    title: 'Ease of use',
    description:
      'Ease of use is one of the main reasons why you should choose Apilytics over other API monitoring solutions.',
  },
  {
    icon: LightningBoltIcon,
    href: staticRoutes.lightweight,
    title: 'Lightweight',
    description:
      'The lightweightness of Apilytics makes it a viable monitoring solution for your application.',
  },
  {
    icon: ShieldCheckIcon,
    href: staticRoutes.privacyFriendly,
    title: 'Privacy-friendly',
    description: 'Apilytics is a privacy-friendly monitoring service for your APIs.',
  },
  {
    icon: GlobeAltIcon,
    href: staticRoutes.openSource,
    title: 'Open source',
    description: 'Monitor your APIs with the power of open source using Apilytics.',
  },
];

const COMMUNITY_ITEMS = [
  {
    external: false,
    icon: RssIcon,
    href: staticRoutes.blog,
    title: 'Blog',
    description: 'Read our blog to learn about the latest updates and features.',
  },
  {
    external: false,
    icon: DocumentSearchIcon,
    href: staticRoutes.docs,
    title: 'Docs',
    description:
      'Documentation for using Apilytics. In-depth guides and tutorials for different tools and technologies.',
  },
  {
    external: true,
    icon: CodeIcon,
    href: staticRoutes.github,
    title: 'Github',
    description:
      'Our Github organizations gives you access to our open source work as well as our Github community.',
  },
  {
    external: true,
    icon: MapIcon,
    href: staticRoutes.roadmap,
    title: 'Public roadmap',
    description: 'Check out our plans for the future and submit your own feature requests.',
  },
];

const MENU_ITEMS = [
  {
    name: 'Origins',
    href: staticRoutes.origins,
  },
  {
    name: 'New origin',
    href: staticRoutes.newOrigin,
  },
  {
    name: 'Account settings',
    href: staticRoutes.account,
  },
  {
    name: 'Log out',
    href: staticRoutes.logout,
  },
  {
    name: 'Feedback',
    href: staticRoutes.contact,
  },
];

export const Header: React.FC<HeaderProps> = ({ maxWidth = DEFAULT_MAX_WIDTH }) => {
  const plausible = usePlausible();
  const { user, accountComplete } = useAccount();
  const maxWidthForNotAuthenticated = maxWidth !== DEFAULT_MAX_WIDTH ? maxWidth : 'max-w-5xl';

  const eventOptions = { location: EVENT_LOCATIONS.HEADER };
  const handleLogoClick = (): void => plausible('logo-click', eventOptions);
  const handlePricingClick = (): void => plausible('pricing-click', eventOptions);
  const handleLoginClick = (): void => plausible('login-click', eventOptions);
  const handleRegisterClick = (): void => plausible('register-click', eventOptions);

  const renderLogo = (
    <div className="flex flex-row items-center">
      <Link href={staticRoutes.root}>
        <a onClick={handleLogoClick}>
          <Image
            src="/logo.svg"
            layout="fixed"
            width={90}
            height={60}
            objectFit="contain"
            alt="Logo"
          />
        </a>
      </Link>
      <div className="badge badge badge-sm badge-primary badge-outline ml-2">Beta</div>
    </div>
  );

  const renderWhyDropdown = (
    <div className="dropdown-hover dropdown">
      <div tabIndex={0} className="btn btn-ghost flex">
        Why Apilytics?
        <ChevronDownIcon className="ml-2 h-5 w-5" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-96 bg-base-200 p-2 text-primary shadow"
      >
        {WHY_ITEMS.map(({ icon: Icon, href, title, description }) => (
          <li key={title}>
            <Link href={href}>
              <a className="unstyled flex flex-col">
                <p className="flex items-center self-start">
                  <Icon className="mr-2 h-5 w-5" /> {title}
                </p>
                <p className="text-sm text-base-content">{description}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderCommunityDropdown = (
    <div className="dropdown-hover dropdown">
      <div tabIndex={0} className="btn btn-ghost flex">
        Community
        <ChevronDownIcon className="ml-2 h-5 w-5" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-96 bg-base-200 p-2 text-primary shadow"
      >
        {COMMUNITY_ITEMS.map(({ external, icon: Icon, href, title, description }) => (
          <li key={title}>
            <Link href={href}>
              <a
                className="unstyled flex flex-col"
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <p className="flex items-center self-start">
                  <Icon className="mr-2 h-5 w-5" /> {title}
                </p>
                <p className="text-sm text-base-content">{description}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderLinksForNotAuthenticated = !user && (
    <div className="hidden lg:flex">
      {renderWhyDropdown}
      {renderCommunityDropdown}
      <Button className="btn-ghost" linkTo={staticRoutes.pricing} onClick={handlePricingClick}>
        Pricing
      </Button>
    </div>
  );

  const renderButtonsForNotAuthenticated = !user && (
    <div className="flex gap-2">
      <div className="dropdown-end dropdown-hover dropdown sm:hidden">
        <div tabIndex={0} className="btn btn-ghost">
          <DotsVerticalIcon className="h-5 w-5" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 text-primary shadow"
        >
          <li onClick={handleRegisterClick}>
            <Link href={staticRoutes.register}>
              <a className="unstyled">Start free trial</a>
            </Link>
          </li>
          <li onClick={handleLoginClick}>
            <Link href={staticRoutes.login}>
              <a className="unstyled">Log in</a>
            </Link>
          </li>
          <li onClick={handlePricingClick}>
            <Link href={staticRoutes.pricing}>
              <a className="unstyled">Pricing</a>
            </Link>
          </li>
        </ul>
      </div>
      <Button
        linkTo={staticRoutes.login}
        className="btn-link hidden sm:block"
        onClick={handleLoginClick}
      >
        Log in
      </Button>
      <Button
        className="btn-primary hidden sm:block"
        linkTo={staticRoutes.register}
        onClick={handleRegisterClick}
      >
        Start free trial
      </Button>
    </div>
  );

  const renderAccountMenu = accountComplete && (
    <div className="dropdown-end dropdown-hover dropdown">
      <div tabIndex={0} className="btn btn-ghost flex">
        <span className="hidden sm:block">{truncateString(user?.name ?? '', 10)}</span>
        <DotsVerticalIcon className="h-5 w-5 sm:ml-2" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 text-primary shadow"
      >
        {MENU_ITEMS.map(({ name, href }) => (
          <li key={name}>
            <Link href={href}>
              <a className="unstyled">{name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderDocsButton = (
    <Button className="btn-ghost hidden sm:block" linkTo={staticRoutes.docs}>
      Docs
    </Button>
  );

  const renderLogoutButton = !accountComplete && (
    <Button linkTo={staticRoutes.logout} className="btn-outline btn-primary hidden sm:block">
      Log out
    </Button>
  );

  const renderButtonsForAuthenticated = user && (
    <div className="flex gap-2">
      {renderDocsButton}
      {renderLogoutButton}
      {renderAccountMenu}
    </div>
  );

  return (
    <header className="flex items-center bg-base-100 py-2">
      <div
        className={clsx(
          'container relative z-10 flex animate-fade-in-top items-center justify-between',
          user ? maxWidth : maxWidthForNotAuthenticated,
        )}
      >
        {renderLogo}
        {renderLinksForNotAuthenticated}
        {renderButtonsForNotAuthenticated}
        {renderButtonsForAuthenticated}
      </div>
    </header>
  );
};
