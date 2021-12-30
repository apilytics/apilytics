import { DotsCircleHorizontalIcon } from '@heroicons/react/outline';
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
    <header className="h-20 flex items-center">
      <div
        className={`container max-w-${maxWidth} flex justify-between items-center animate-fade-in animation-delay-800 relative z-10`}
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
              <Button variant="secondary" transparent className="w-auto">
                Log in
              </Button>
            </Link>
          )
        ) : (
          <details className="text-secondary">
            <summary className="text-2xl p-2 rounded-lg flex items-center outline-none cursor-pointer border-secondary hover:text-secondary-dark hover:border-secondary-dark">
              {user.name} <DotsCircleHorizontalIcon className="h-6 w-6 ml-2" />
            </summary>
            <div className="absolute top-full right-0">
              <ul className="bg-zinc-900 rounded-lg w-40 text-lg list-none cursor-pointer overflow-hidden divide-y">
                {MENU_ITEMS.map(({ name, href }) => (
                  <Link href={href} passHref key={name}>
                    <li className="p-3 hover:bg-zinc-800">{name}</li>
                  </Link>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>
    </header>
  );
};
