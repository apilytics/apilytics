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
    <Layout title={title} description={description} indexable>
      <div className="container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col height-full max-w-3xl">
        <div className="card rounded-lg shadow p-4 bg-base-100 break-words items-start text-white">
          <BackButton text="All blogs" linkTo={staticRoutes.blog} />
          <h3>{title}</h3>
          <div className="flex flex-col sm:flex-row p-2 text-sm text-base-content">
            <span>
              Written by <ExternalLink href={authorLink}>{author}</ExternalLink>
            </span>
            <span className="mx-2 hidden sm:block">·</span>
            <span>{dayjs(date).format('LL')}</span>
          </div>
          <MDX source={source} />
          <p className="mt-4 text-base-content text-sm">
            Written by <ExternalLink href={authorLink}>{author}</ExternalLink>
          </p>
        </div>
        <CTASection />
        <div
          className={clsx('grid gap-2', previousBlog && nextBlog ? 'grid-cols-2' : 'grid-cols-1')}
        >
          {previousBlog && (
            <BlogCard
              {...previousBlog}
              title={
                <>
                  <span className="text-primary">Previous:</span> {previousBlog.title}
                </>
              }
            />
          )}
          {nextBlog && (
            <BlogCard
              {...nextBlog}
              title={
                <>
                  <span className="text-primary">Next:</span> {nextBlog.title}
                </>
              }
            />
          )}
        </div>
      </div>
    </Layout>
  );
};
