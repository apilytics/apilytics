import { DotsVerticalIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import { ORIGIN_ROLES } from 'utils/constants';
import { dynamicRoutes } from 'utils/router';

interface Props {
  slug: string;
  userRole: ORIGIN_ROLES;
}

export const OriginMenu: React.FC<Props> = ({ slug, userRole }) => {
  const disabled = userRole === ORIGIN_ROLES.VIEWER;

  return (
    <div className="dropdown-end dropdown">
      <div tabIndex={0} className="btn btn-ghost" onClick={(e): void => e.preventDefault()}>
        <DotsVerticalIcon className="h-5 w-5" />
      </div>
      <ul
        tabIndex={0}
        className="card-bordered dropdown-content menu rounded-box whitespace-nowrap bg-base-100 p-2 text-primary shadow"
      >
        <li className={clsx(disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originSettings({ slug })}>
            <a className="unstyled">Settings</a>
          </Link>
        </li>
        <li className={clsx(disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originDynamicRoutes({ slug })}>
            <a className="unstyled">Dynamic routes</a>
          </Link>
        </li>
        <li className={clsx(disabled && 'disabled pointer-events-none')}>
          <Link href={dynamicRoutes.originUsers({ slug })}>
            <a className="unstyled">Users</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};
