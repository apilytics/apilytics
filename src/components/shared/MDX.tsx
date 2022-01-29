import dayjs from 'dayjs';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react';

import { Button } from 'components/shared/Button';
import { EmailLink } from 'components/shared/EmailLink';
import { ExternalLink } from 'components/shared/ExternalLink';
import { FrameworkSelection } from 'components/shared/FrameworkSelection';
import { SwaggerUI } from 'components/shared/SwaggerUI';
import { FRONTEND_URL, staticRoutes } from 'utils/router';
import type { MDXPageProps } from 'types';

const components = {
  Button,
  Link,
  ExternalLink,
  EmailLink,
  SwaggerUI,
  Date: ({ date }: { date: string }): string => dayjs(date).format('LL'),
  FrameworkSelection,
};

const scope = {
  routes: staticRoutes,
  FRONTEND_URL,
};

export const MDX: React.FC<MDXPageProps> = ({ source }) => (
  <MDXRemote {...source} components={components} scope={scope} lazy />
);
