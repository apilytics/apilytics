import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import { BackButton } from 'components/shared/BackButton';
import { BlogCard } from 'components/shared/BlogCard';
import { CTASection } from 'components/shared/CTASection';
import { ExternalLink } from 'components/shared/ExternalLink';
import { MDX } from 'components/shared/MDX';
import { staticRoutes } from 'utils/router';
import type { BlogPageProps } from 'types';

export const BlogTemplate: React.FC<BlogPageProps> = ({
  source,
  data: { title, description, author, authorLink, date },
  blogsData,
}) => {
  const currentBlogIndex = blogsData.findIndex((blog) => blog.title === title);

  // The blogs are in reverse chronological order.
  const previousBlog = blogsData[currentBlogIndex + 1];
  const nextBlog = blogsData[currentBlogIndex - 1];

  return (
    <Layout headProps={{ title, description, indexable: true }}>
      <div className="height-full container flex max-w-3xl grow animate-fade-in-top flex-col py-4 lg:pt-16">
        <div className="card items-start break-words rounded-lg bg-base-100 p-4 shadow">
          <BackButton text="All blogs" linkTo={staticRoutes.blog} />
          <h3>{title}</h3>
          <p className="text-sm">
            <ExternalLink href={authorLink}>{author}</ExternalLink> · {dayjs(date).format('LL')}
          </p>
          <MDX source={source} />
          <p className="mt-4 text-sm">
            <ExternalLink href={authorLink}>{author}</ExternalLink> · {dayjs(date).format('LL')}
          </p>
        </div>
        <div
          className={clsx(
            'mt-4 grid gap-4',
            previousBlog && nextBlog ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {previousBlog && (
            <BlogCard
              {...previousBlog}
              title={
                <>
                  <span className="text-primary">Previous blog:</span>
                  <br />
                  {previousBlog.title}
                </>
              }
            />
          )}
          {nextBlog && (
            <BlogCard
              {...nextBlog}
              title={
                <>
                  <span className="text-primary">Next blog:</span>
                  <br />
                  {nextBlog.title}
                </>
              }
            />
          )}
        </div>
        <CTASection />
      </div>
    </Layout>
  );
};
