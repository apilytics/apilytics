import { CogIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';

import { dynamicRoutes } from 'utils/router';

interface Props {
  slug: string;
  size?: number;
}

export const OriginSettingsButton: React.FC<Props> = ({ slug, size = 8 }) => (
  <Link href={dynamicRoutes.originSettings({ slug })} passHref>
    <button className="btn btn-circle ml-4 border-none">
      <CogIcon className={`h-${size} w-${size}`} />
    </button>
  </Link>
);
