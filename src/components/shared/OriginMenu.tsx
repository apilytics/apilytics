import { DotsVerticalIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

import { dynamicRoutes } from 'utils/router';

interface Props {
  slug: string;
}

export const OriginMenu: React.FC<Props> = ({ slug }) => (
  <div className="dropdown dropdown-hover dropdown-end">
    <div tabIndex={0} className="btn btn-ghost">
      <DotsVerticalIcon className="w-5 h-5" />
    </div>
    <ul
      tabIndex={0}
      className="p-2 shadow menu dropdown-content bg-base-200 rounded-box w-52 text-primary"
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
