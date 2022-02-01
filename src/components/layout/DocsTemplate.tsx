import { ArrowSmRightIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { Fragment } from 'react';

import { Layout } from 'components/layout/Layout';
import { BackButton } from 'components/shared/BackButton';
import { Button } from 'components/shared/Button';
import { CTASection } from 'components/shared/CTASection';
import { MDX } from 'components/shared/MDX';
import { staticRoutes } from 'utils/router';
import type { DocsPageProps } from 'types';

export const DocsTemplate: React.FC<DocsPageProps> = ({
  source,
  data: { name, description, order, subOrder = 0, updatedAt },
  docsData,
}) => {
  const previousDoc = docsData.find((doc) => doc.order === order - 1);

  const nextDoc = docsData?.find((doc) => {
    if (doc.order === order && doc.subOrder) {
      return doc.subOrder == subOrder + 1;
    }

    return doc.order === order + 1;
  });

  return (
    <Layout
      headProps={{ title: name, description, indexable: true }}
      headerProps={{ maxWidth: 'max-w-full' }}
    >
      <ul className="menu p-4 w-50 h-full absolute border-r border-1 border-base-content invisible xl:visible text-primary">
        {docsData
          ?.filter(({ subOrder }) => !subOrder)
          .map(({ path, name, order: parentOrder }) => (
            <Fragment key={path}>
              <li>
                <Link href={path}>
                  <a>{name}</a>
                </Link>
              </li>
              <ul className="menu">
                {docsData
                  ?.filter(({ order, subOrder }) => order === parentOrder && subOrder)
                  .map(({ name, path }) => (
                    <li key={path}>
                      <Link href={path}>
                        <a>{name}</a>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Fragment>
          ))}
      </ul>
      <div className="container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col height-full max-w-3xl">
        <div className="card rounded-lg shadow p-4 bg-base-100 break-words text-white">
          {previousDoc && <BackButton linkTo={previousDoc.path} text={previousDoc.name} />}
          <MDX source={source} />
          <div className="flex justify-between flex-wrap items-center mt-4">
            <p className="text-base-content">Last updated: {dayjs(updatedAt).format('LL')}</p>
            {nextDoc && (
              <Button linkTo={nextDoc.path} endIcon={ArrowSmRightIcon} className="btn-link p-0">
                {nextDoc.name}
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4">
          Help us improve these docs by{' '}
          <Link href={staticRoutes.contact}>
            <a>giving us feedback</a>
          </Link>
          .
        </p>
        <CTASection />
      </div>
    </Layout>
  );
};
