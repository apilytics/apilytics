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
    <button>
      <CogIcon className={`h-${size} w-${size} text-secondary ml-4`} />
    </button>
  </Link>
);
