import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from 'components/shared/Button';
import { useAccount } from 'hooks/useAccount';
import { staticRoutes } from 'utils/router';
import type { HeaderProps } from 'types';

const MENU_ITEMS = [
  {
    name: 'Origins',
    href: staticRoutes.origins,
  },
  {
    name: 'Account',
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

export const Header: React.FC<HeaderProps> = ({ maxWidth }) => {
  const { user } = useAccount();

  const renderDynamicContent = (): JSX.Element => {
    if (!user) {
      return (
        <Link href={staticRoutes.login} passHref>
          <Button className="btn-primary btn-outline">Log in</Button>
        </Link>
      );
    }

    if (!user?.name) {
      return (
        <Link href={staticRoutes.logout} passHref>
          <Button className="btn-primary btn-outline">Log out</Button>
        </Link>
      );
    }

    return (
      <div className="flex items-center">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-primary btn-outline">
            {user?.name}
          </div>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-primary"
          >
            {MENU_ITEMS.map(({ name, href }) => (
              <li key={name}>
                <Link href={href} passHref>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <header className="py-2 flex items-center bg-base-100">
      <div
        className={clsx(
          'container flex justify-between items-center animate-fade-in-top relative z-10',
          maxWidth,
        )}
      >
        <div className="flex items-center">
          <Link href={staticRoutes.root}>
            <a>
              <Image
                src="/logo.svg"
                layout="fixed"
                width={80}
                height={60}
                objectFit="contain"
                alt="Logo"
              />
            </a>
          </Link>
          <div className="ml-4 badge badge-lg badge-primary">Beta</div>
        </div>
        <div className="flex items-center">
          <Link href={staticRoutes.docs} passHref>
            <Button className="btn-secondary btn-outline mr-4 hidden sm:block">Docs</Button>
          </Link>
          {renderDynamicContent()}
        </div>
      </div>
    </header>
  );
};
