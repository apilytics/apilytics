import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { routes } from 'utils/router';
import type { HeaderProps } from 'types';

export const Header: React.FC<HeaderProps> = ({ headerMaxWidth }) => (
  <header className="h-20 flex items-center">
    <div className={`container animate-fade-in animation-delay-1200 max-w-${headerMaxWidth}`}>
      <Link href={routes.root}>
        <a>
          <Image
            src="/logo.svg"
            layout="fixed"
            width={100}
            height={80}
            objectFit="contain"
            alt="Logo"
          />
        </a>
      </Link>
    </div>
  </header>
);
