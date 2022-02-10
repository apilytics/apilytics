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
      <div className="card h-full rounded-lg bg-base-100 p-2 hover:bg-gray-700">
        <div className="flex grow flex-col p-2">
          <h5 className="text-white">{title}</h5>
          <p>{excerpt}</p>
        </div>
        <p className="px-2 text-sm text-base-content">
          <ExternalLink href={authorLink}>{author}</ExternalLink> · {dayjs(date).format('LL')}
        </p>
      </div>
    </a>
  </Link>
);
