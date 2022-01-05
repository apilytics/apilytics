import { CogIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import type { HTMLAttributes } from 'react';

import { dynamicRoutes } from 'utils/router';

interface Props extends Pick<HTMLAttributes<HTMLButtonElement>, 'className'> {
  slug: string;
  small?: boolean;
}

export const OriginSettingsButton: React.FC<Props> = ({ slug, small, className }) => (
  <Link href={dynamicRoutes.originSettings({ slug })} passHref>
    <button className={clsx('btn btn-circle bg-transparent border-none', className)}>
      <CogIcon className={clsx(small ? 'h-6 w-6' : 'h-8 w-8')} />
    </button>
  </Link>
);
