import { MDXRemote } from 'next-mdx-remote';
import React from 'react';

import { Button } from 'components/shared/Button';
import { ExternalLink } from 'components/shared/ExternalLink';
import type { MDXPageProps } from 'types';

const components = {
  Button,
  ExternalLink,
};

export const MDX: React.FC<MDXPageProps> = ({ source }) => (
  <MDXRemote {...source} components={components} />
);
