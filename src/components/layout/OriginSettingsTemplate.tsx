import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { useContext } from 'hooks/useContext';
import { ORIGIN_MENU_KEYS } from 'utils/constants';
import { dynamicRoutes } from 'utils/router';
import type { MainTemplateProps } from 'types';

interface Props extends MainTemplateProps {
  activeItem: ORIGIN_MENU_KEYS;
}

export const OriginSettingsTemplate: React.FC<Props> = ({ headProps, activeItem, children }) => {
  const { origin } = useContext();
  const { slug = '', dynamicRouteCount, excludedRouteCount, userCount } = origin ?? {};

  const menuItems = [
    {
      href: dynamicRoutes.originSettings({ slug }),
      key: ORIGIN_MENU_KEYS.SETTINGS,
      label: 'Settings',
    },
    {
      href: dynamicRoutes.originDynamicRoutes({ slug }),
      key: ORIGIN_MENU_KEYS.DYNAMIC_ROUTES,
      label: `Dynamic routes (${dynamicRouteCount})`,
    },
    {
      href: dynamicRoutes.originExcludedRoutes({ slug }),
      key: ORIGIN_MENU_KEYS.EXCLUDED_ROUTES,
      label: `Excluded routes (${excludedRouteCount})`,
    },
    {
      href: dynamicRoutes.originUsers({ slug }),
      key: ORIGIN_MENU_KEYS.USERS,
      label: `Users (${userCount})`,
    },
  ];

  return (
    <MainTemplate headProps={headProps}>
      <div className="flex gap-2">
        <div className="card rounded-lg bg-base-100 shadow">
          <div className="p-4">
            <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
          </div>
          <ul className="menu w-60 text-primary">
            {menuItems.map(({ href, key, label }) => (
              <li key={key}>
                <Link href={href}>
                  <a className={clsx(key === activeItem && 'active')}>{label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card rounded-lg bg-base-100 p-4 shadow">{children}</div>
      </div>
    </MainTemplate>
  );
};
