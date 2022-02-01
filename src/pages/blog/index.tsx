import Link from 'next/link';
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
    headProps={{
      title: 'Blog',
      description:
        'Stay updated about Apilytics by following our blog. Follow our journey and learn about our new and upcoming features.',
      indexable: true,
    }}
  >
    <h4 className="text-white">Apilytics blog</h4>
    <p>
      Hi there! 👋 You can read about our journey in this blog.
      <br />
      Join our <Link href="#email-input">email list</Link> to receive updates in your email.
    </p>
    <div className="py-4 flex flex-col gap-4">
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
