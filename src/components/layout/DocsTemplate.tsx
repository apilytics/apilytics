import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { Fragment } from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { staticRoutes } from 'utils/router';
import type { FrontMatter } from 'types';

interface Props extends Partial<FrontMatter> {
  docsInfo?: FrontMatter[];
}

export const DocsTemplate: React.FC<Props> = ({
  name,
  order,
  subOrder = 0,
  docsInfo,
  children,
}) => {
  if (!order) {
    throw Error(`Missing order for ${name}!`);
  }

  const invalidRouteName = docsInfo?.find(
    (doc) => !Object.keys(staticRoutes).includes(doc.routeName),
  )?.routeName;

  if (invalidRouteName) {
    throw Error(`Invalid route name ${invalidRouteName}!`);
  }

  const nextRoute = docsInfo?.find((doc) => {
    if (doc.order === order && doc.subOrder) {
      return doc.subOrder == subOrder + 1;
    }

    return doc.order === order + 1;
  });

  return (
    <Layout maxWidth="max-w-full">
      <ul className="menu p-4 w-50 h-full absolute border-r border-1 border-base-content invisible xl:visible text-primary">
        {docsInfo
          ?.filter(({ subOrder }) => !subOrder)
          .map(({ name, routeName, order: parentOrder }) => (
            <Fragment key={routeName}>
              <li>
                <Link href={staticRoutes[routeName as keyof typeof staticRoutes]}>{name}</Link>
              </li>
              <ul className="menu">
                {docsInfo
                  ?.filter(({ order, subOrder }) => order === parentOrder && subOrder)
                  .map(({ name, routeName }) => (
                    <li key={routeName}>
                      <Link href={staticRoutes[routeName as keyof typeof staticRoutes]}>
                        {name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </Fragment>
          ))}
      </ul>
      <div className="container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col height-full max-w-3xl">
        <div className="card rounded-lg shadow p-4 bg-base-100 break-words items-start">
          {children}
          {nextRoute && (
            <Link href={staticRoutes[nextRoute.routeName]} passHref>
              <Button
                className="btn-secondary btn-outline mt-8 mx-auto"
                endIcon={ArrowSmRightIcon}
                fullWidth="mobile"
              >
                {nextRoute.name}
              </Button>
            </Link>
          )}
        </div>
        <p className="mt-4 text-center">
          Help us improve these docs by <Link href={staticRoutes.contact}>giving us feedback</Link>.
        </p>
      </div>
    </Layout>
  );
};
