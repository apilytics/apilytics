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

export const Header: React.FC<HeaderProps> = ({ maxWidth, hideLogin }) => {
  const { user } = useAccount();

  return (
    <header className="h-20 flex items-center bg-base-300">
      <div
        className={clsx(
          'container flex justify-between items-center animate-fade-in-top relative z-10',
          `max-w-${maxWidth}`,
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
        {!user ? (
          !hideLogin && (
            <Link href={staticRoutes.login} passHref>
              <Button variant="outlined">Log in</Button>
            </Link>
          )
        ) : (
          <div className="dropdown">
            <div tabIndex={0} className="btn btn-primary btn-outline">
              {user.name}
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
        )}
      </div>
    </header>
  );
};
