import { DotsVerticalIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import { ORIGIN_ROLES } from 'utils/constants';
import { dynamicRoutes } from 'utils/router';

interface Props {
  slug: string;
  userRole?: ORIGIN_ROLES;
  userCount: number;
  dynamicRouteCount?: number;
  excludedRouteCount?: number;
}

export const OriginMenu: React.FC<Props> = ({
  slug,
  userRole,
  userCount,
  dynamicRouteCount,
  excludedRouteCount,
}) => {
  const disabled = userRole === ORIGIN_ROLES.VIEWER;

  return (
    <div className="dropdown-end dropdown">
      <div tabIndex={0} className="btn btn-ghost" onClick={(e): void => e.preventDefault()}>
        <DotsVerticalIcon className="h-5 w-5" />
      </div>
      <ul
        tabIndex={0}
        className="card-bordered dropdown-content menu rounded-box whitespace-nowrap bg-base-100 p-2 shadow"
      >
        <li className={clsx('text-primary', disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originSettings({ slug })}>
            <a className="unstyled">Origin settings</a>
          </Link>
        </li>
        <li className={clsx('text-primary', disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originDynamicRoutes({ slug })}>
            <a className="unstyled">Dynamic routes ({dynamicRouteCount})</a>
          </Link>
        </li>
        <li className={clsx('text-primary', disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originExcludedRoutes({ slug })}>
            <a className="unstyled">Excluded routes ({excludedRouteCount})</a>
          </Link>
        </li>
        <li className={clsx('text-primary', disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originUsers({ slug })}>
            <a className="unstyled">Manage users ({userCount})</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};
