import { DotsCircleHorizontalIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Button } from 'components/shared/Button';
import { routes } from 'utils/router';
import type { HeaderProps } from 'types';

const MENU_ITEMS = [
  {
    name: 'Dashboard',
    href: routes.dashboard,
  },
  {
    name: 'Account',
    href: routes.account,
  },
  {
    name: 'Log out',
    href: routes.logout,
  },
];

export const Header: React.FC<HeaderProps> = ({ headerMaxWidth, hideLogin }) => {
  const { user } = useSession().data || {};

  return (
    <header className="h-20 flex items-center">
      <div
        className={`container flex justify-between items-center animate-fade-in animation-delay-1200 max-w-${headerMaxWidth} relative z-10`}
      >
        <Link href={routes.root}>
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
            <Link href={routes.login} passHref>
              <Button variant="secondary" transparent className="w-auto">
                Log in
              </Button>
            </Link>
          )
        ) : (
          <details className="text-primary">
            <summary className="text-2xl p-2 rounded-lg flex items-center outline-none cursor-pointer">
              {user.name} <DotsCircleHorizontalIcon className="h-6 w-6 ml-2" />
            </summary>
            <div className="absolute top-full right-0">
              <ul className="bg-black shadow border-secondary rounded-lg w-40 text-lg divide-y list-none cursor-pointer">
                {MENU_ITEMS.map(({ name, href }) => (
                  <Link href={href} passHref key={name}>
                    <li className="p-2">{name}</li>
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
