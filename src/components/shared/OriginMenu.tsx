import { DotsVerticalIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

import { dynamicRoutes } from 'utils/router';

interface Props {
  slug: string;
}

export const OriginMenu: React.FC<Props> = ({ slug }) => (
  <div className="dropdown-end dropdown-hover dropdown">
    <div tabIndex={0} className="btn btn-ghost">
      <DotsVerticalIcon className="h-5 w-5" />
    </div>
    <ul
      tabIndex={0}
      className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 text-primary shadow"
    >
      <li>
        <Link href={dynamicRoutes.originSettings({ slug })}>
          <a className="unstyled">Origin settings</a>
        </Link>
      </li>
      <li>
        <Link href={dynamicRoutes.originDynamicRoutes({ slug })}>
          <a className="unstyled">Dynamic routes</a>
        </Link>
      </li>
    </ul>
  </div>
);
