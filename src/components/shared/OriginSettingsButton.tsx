import { CogIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import type { HTMLAttributes } from 'react';

import { dynamicRoutes } from 'utils/router';

const SIZES = {
  6: 'h-6 w-6',
  8: 'h-8 w-8',
};

interface Props extends Pick<HTMLAttributes<HTMLButtonElement>, 'className'> {
  slug: string;
  size?: keyof typeof SIZES;
}

export const OriginSettingsButton: React.FC<Props> = ({ slug, size = 8, className }) => (
  <Link href={dynamicRoutes.originSettings({ slug })} passHref>
    <button className={clsx('btn btn-circle bg-transparent border-none', className)}>
      <CogIcon className={SIZES[size]} />
    </button>
  </Link>
);
