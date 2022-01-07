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
];

export const Header: React.FC<HeaderProps> = ({ maxWidth }) => {
  const { user } = useAccount();

  const renderDynamicContent = (): JSX.Element => {
    if (!user) {
      return (
        <Link href={staticRoutes.login} passHref>
          <Button variantClass="btn-outline" colorClass="btn-primary">
            Log in
          </Button>
        </Link>
      );
    }

    if (!user?.name) {
      return (
        <Link href={staticRoutes.logout} passHref>
          <Button variantClass="btn-outline" colorClass="btn-primary">
            Log out
          </Button>
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
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
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
    <header className="h-20 flex items-center bg-base-100">
      <div
        className={clsx(
          'container flex justify-between items-center animate-fade-in-top relative z-10',
          maxWidth,
        )}
      >
        <Link href={staticRoutes.root}>
          <a>
            <Image
              src="/logo.svg"
              layout="fixed"
              width={100}
              height={80}
              objectFit="contain"
              alt="Logo"
            />
          </a>
        </Link>
        <div className="flex items-center">
          <h2 className="text-xl mr-4">Beta</h2>
          <Link href={staticRoutes.docs} passHref>
            <Button variantClass="btn-outline" colorClass="btn-secondary" className="mr-4">
              Docs
            </Button>
          </Link>
          {renderDynamicContent()}
        </div>
      </div>
    </header>
  );
};
