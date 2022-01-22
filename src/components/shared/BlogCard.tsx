import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';

import { ExternalLink } from 'components/shared/ExternalLink';
import { dynamicRoutes } from 'utils/router';
import type { BlogsFrontMatter } from 'types';

interface Props extends Omit<BlogsFrontMatter, 'title'> {
  title: JSX.Element | string;
}

export const BlogCard: React.FC<Props> = ({ slug, title, excerpt, author, authorLink, date }) => (
  <Link href={dynamicRoutes.blog({ slug })}>
    <a className="unstyled">
      <div className="bg-base-100 hover:bg-gray-700 card rounded-lg p-2">
        <div className="flex flex-col p-2">
          <h5 className="text-white">{title}</h5>
          <p>{excerpt}</p>
        </div>
        <div className="flex flex-col sm:flex-row p-2 text-sm">
          <span>
            Written by <ExternalLink href={authorLink}>{author}</ExternalLink>
          </span>
          <span className="mx-2 hidden sm:block">·</span>
          <span>{dayjs(date).format('LL')}</span>
        </div>
      </div>
    </a>
  </Link>
);
