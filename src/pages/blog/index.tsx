import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { EmailListForm } from 'components/shared/EmailListForm';
import { withAccount } from 'hocs/withAccount';
import { getBlogsData } from 'utils/mdx';
import { dynamicRoutes } from 'utils/router';
import type { BlogPageProps } from 'types';

const Blogs: NextPage<BlogPageProps> = ({ blogsData }) => (
  <MainTemplate hideEmailList noIndex={false}>
    <h5 className="text-white">Apilytics Blog</h5>
    <EmailListForm
      label={
        <>
          Hi there! 👋
          <br />
          You can read about our journey in this blog.
        </>
      }
    />
    <div className="py-4 flex flex-col gap-2">
      {blogsData.map(({ title, slug, author, authorImage, excerpt, readingTime, date }) => (
        <Link href={dynamicRoutes.blog({ slug })} key={slug}>
          <a className="unstyled">
            <div className="bg-base-100 hover:bg-gray-700 card rounded-lg p-2" key={slug}>
              <div className="flex flex-col p-2">
                <h5 className="text-white">{title}</h5>
                <p>{excerpt}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center p-2">
                <div className="flex">
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
            </div>
          </a>
        </Link>
      ))}
    </div>
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

export default withAccount(Blogs);
