import dayjs from 'dayjs';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { ExternalLink } from 'components/shared/ExternalLink';
import type { BlogPageProps } from 'types';

const components = {
  ExternalLink,
};

export const BlogTemplate: React.FC<BlogPageProps> = ({
  source,
  data: { title, author, authorImage, readingTime, date },
}) => (
  <Layout maxWidth="max-w-3xl">
    <div className="container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col height-full max-w-3xl">
      <div className="card rounded-lg shadow p-4 bg-base-100 break-words items-start text-white">
        <h3>{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center px-2 text-base-content py-4">
          <div className="flex items-center">
            <Image
              src={authorImage}
              layout="fixed"
              width={25}
              height={25}
              alt="Author Image"
              className="rounded-full"
            />
            <p className="ml-2">{author}</p>
          </div>
          <span className="ml-2 hidden sm:block">·</span>
          <p className="sm:ml-2">{readingTime}</p>
          <span className="ml-2 hidden sm:block">·</span>
          <p className="sm:ml-2">{dayjs(date).format('LL')}</p>
        </div>
        <MDXRemote {...source} components={components} />
        <Button linkTo="/" className="btn-secondary btn-outline mt-8 mx-auto">
          Try Apilytics
        </Button>
      </div>
    </div>
  </Layout>
);
