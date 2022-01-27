import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { Fragment } from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { CTASection } from 'components/shared/CTASection';
import { MDX } from 'components/shared/MDX';
import { staticRoutes } from 'utils/router';
import type { DocsPageProps } from 'types';

export const DocsTemplate: React.FC<DocsPageProps> = ({
  source,
  data: { name, description, order, subOrder = 0 },
  docsData,
}) => {
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
          <MDX source={source} />
          {nextDoc && (
            <Button
              linkTo={nextDoc.path}
              endIcon={ArrowSmRightIcon}
              fullWidth="mobile"
              className="btn-link mt-8 mx-auto"
            >
              {nextDoc.name}
            </Button>
          )}
        </div>
        <p className="mt-4 text-center">
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
