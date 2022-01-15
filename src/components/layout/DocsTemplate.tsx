import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import React, { Fragment } from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { ExternalLink } from 'components/shared/ExternalLink';
import { staticRoutes } from 'utils/router';
import type { DocsPageProps } from 'types';

const components = {
  Link,
  Button,
  ExternalLink,
};

export const DocsTemplate: React.FC<DocsPageProps> = ({
  source,
  data: { order, subOrder = 0 },
  docsData,
}) => {
  const nextRoute = docsData?.find((doc) => {
    if (doc.order === order && doc.subOrder) {
      return doc.subOrder == subOrder + 1;
    }

    return doc.order === order + 1;
  });

  return (
    <Layout maxWidth="max-w-full">
      <ul className="menu p-4 w-50 h-full absolute border-r border-1 border-base-content invisible xl:visible text-primary">
        {docsData
          ?.filter(({ subOrder }) => !subOrder)
          .map(({ name, routeName, order: parentOrder }) => (
            <Fragment key={routeName}>
              <li>
                <Link href={staticRoutes[routeName as keyof typeof staticRoutes]}>
                  <a>{name}</a>
                </Link>
              </li>
              <ul className="menu">
                {docsData
                  ?.filter(({ order, subOrder }) => order === parentOrder && subOrder)
                  .map(({ name, routeName }) => (
                    <li key={routeName}>
                      <Link href={staticRoutes[routeName as keyof typeof staticRoutes]}>
                        <a>{name}</a>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Fragment>
          ))}
      </ul>
      <div className="container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col height-full max-w-3xl">
        <div className="card rounded-lg shadow p-4 bg-base-100 break-words items-start text-white">
          <MDXRemote {...source} components={components} />
          {nextRoute && (
            <Button
              linkTo={staticRoutes[nextRoute.routeName]}
              endIcon={ArrowSmRightIcon}
              fullWidth="mobile"
              className="btn-secondary btn-outline mt-8 mx-auto"
            >
              {nextRoute.name}
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
      </div>
    </Layout>
  );
};
