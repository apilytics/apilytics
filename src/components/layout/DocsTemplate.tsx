import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { staticRoutes } from 'utils/router';
import type { FrontMatter } from 'types';

interface Props extends Partial<FrontMatter> {
  docsInfo?: FrontMatter[];
}

export const DocsTemplate: React.FC<Props> = ({ order, docsInfo, children }) => {
  const nextRoute = order && docsInfo?.find((doc) => doc.order === order + 1);

  return (
    <Layout maxWidth="max-w-full">
      <ul className="menu p-4 w-80 h-full absolute border-r border-1 border-base-content invisible lg:visible text-primary">
        {docsInfo?.map(({ name, routeName }) => (
          <li key={routeName}>
            <Link href={staticRoutes[routeName as keyof typeof staticRoutes]}>{name}</Link>
          </li>
        ))}
      </ul>
      <div className="container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col height-full max-w-3xl">
        <div className="card rounded-lg shadow-2xl p-4 bg-base-100 break-words items-start">
          {children}
          {nextRoute && (
            <Link href={staticRoutes[nextRoute.routeName]} passHref>
              <Button className="btn-primary btn-outline mt-4">
                {nextRoute.name} <ArrowSmRightIcon className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};
