import { DotsVerticalIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from 'components/shared/Button';
import { useAccount } from 'hooks/useAccount';
import { truncateString } from 'utils/helpers';
import { staticRoutes } from 'utils/router';
import type { HeaderProps } from 'types';

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

export const Header: React.FC<HeaderProps> = ({ maxWidth, hideLogin }) => {
  const { user, accountComplete } = useAccount();

  const renderDynamicContent = (): JSX.Element | void => {
    if (!user && !hideLogin) {
      return (
        <Button linkTo={staticRoutes.login} className="btn-primary btn-outline">
          Log in
        </Button>
      );
    }

    if (!!user && !accountComplete) {
      return (
        <Button linkTo={staticRoutes.logout} className="btn-primary btn-outline">
          Log out
        </Button>
      );
    }

    if (user) {
      return (
        <div className="flex items-center">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost flex">
              <span className="hidden sm:block">{truncateString(user?.name, 10)}</span>
              <DotsVerticalIcon className="sm:ml-2 w-5 h-5" />
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-primary"
            >
              {MENU_ITEMS.map(({ name, href }) => (
                <li key={name}>
                  <Link href={href}>
                    <a>{name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  };

  return (
    <header className="py-2 flex items-center bg-base-100">
      <div
        className={clsx(
          'container flex justify-between items-center animate-fade-in-top relative z-10',
          maxWidth,
        )}
      >
        <div className="flex flex-row items-center">
          <Link href={staticRoutes.root}>
            <a>
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
          <div className="ml-2 badge badge badge-primary badge-sm badge-outline">Beta</div>
        </div>
        <div className="flex items-center">
          <Button
            linkTo={staticRoutes.docs}
            className="btn-secondary btn-outline mr-4 hidden sm:block"
          >
            Docs
          </Button>
          {renderDynamicContent()}
        </div>
      </div>
    </header>
  );
};
