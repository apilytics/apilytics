import { MDXRemote } from 'next-mdx-remote';
import React from 'react';

import { Button } from 'components/shared/Button';
import { ExternalLink } from 'components/shared/ExternalLink';
import { SwaggerUI } from 'components/shared/SwaggerUI';
import type { MDXPageProps } from 'types';

const components = {
  Button,
  ExternalLink,
  SwaggerUI,
};

export const MDX: React.FC<MDXPageProps> = ({ source }) => (
  <MDXRemote {...source} components={components} />
);
