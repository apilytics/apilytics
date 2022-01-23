import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BlogCard } from 'components/shared/BlogCard';
import { CTASection } from 'components/shared/CTASection';
import { withUser } from 'hocs/withUser';
import { getBlogsData } from 'utils/mdx';
import type { BlogPageProps } from 'types';

const Blogs: NextPage<BlogPageProps> = ({ blogsData }) => (
  <MainTemplate
    indexable
    title="Blog"
    description="Stay updated about Apilytics by following our blog."
  >
    <h4 className="text-white">Apilytics Blog</h4>
    <p>Hi there! 👋 You can read about our journey in this blog.</p>
    <div className="py-4 flex flex-col gap-2">
      {blogsData.map((blog) => (
        <BlogCard {...blog} key={blog.title} />
      ))}
    </div>
    <CTASection />
  </MainTemplate>
);

export const getStaticProps: GetStaticProps = async () => {
  const blogsData = getBlogsData();

  return {
    props: {
      blogsData,
    },
  };
};

export default withUser(Blogs);
