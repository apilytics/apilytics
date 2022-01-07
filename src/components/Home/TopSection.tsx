import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { RequestsOverview } from 'components/dashboard/RequestsOverview';
import { Button } from 'components/shared/Button';
import { MOCK_METRICS, MOCK_ORIGIN } from 'mocks';
import { DESCRIPTION, LAST_7_DAYS_VALUE } from 'utils/constants';
import { staticRoutes } from 'utils/router';

const INTEGRATIONS = [
  {
    name: 'JavaScript',
    image: '/integration-logos/javascript-logo.png',
  },
  {
    name: 'Python',
    image: '/integration-logos/python-logo.png',
  },
  {
    name: 'Ruby',
    image: '/integration-logos/ruby-logo.png',
  },
  {
    name: 'Go',
    image: '/integration-logos/go-logo.png',
  },
  {
    name: 'C#',
    image: '/integration-logos/c-sharp-logo.png',
  },
  {
    name: 'Java',
    image: '/integration-logos/java-logo.svg',
  },
  {
    name: 'PHP',
    image: '/integration-logos/php-logo.png',
  },
];

const timeFrame = LAST_7_DAYS_VALUE;
const origin = MOCK_ORIGIN;
const metrics = MOCK_METRICS[timeFrame];
const loading = !origin || !metrics;

export const TopSection: React.FC = () => (
  <div className="bg-background bg-no-repeat bg-cover">
    <div className="bg-filter">
      <div className="container py-16 grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="text-left">
          <h1 className="text-7xl text-white">
            <span className="text-primary">API analytics</span>
            <br />
            made easy
          </h1>
          <h2 className="text-2xl mt-12">{DESCRIPTION}</h2>
          <p className="text-xl mt-12">Simple integration with any backend</p>
          <div className="flex flex-wrap gap-4 mt-8 grayscale">
            {INTEGRATIONS.map(({ name, image }) => (
              <div key={name}>
                <Image
                  src={image}
                  layout="fixed"
                  width={60}
                  height={60}
                  quality={5}
                  objectFit="contain"
                  alt={name}
                  priority
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:inline-grid mt-8">
            <Link href={staticRoutes.login} passHref>
              <Button colorClass="btn-primary">Get started</Button>
            </Link>
            <Link href={staticRoutes.demo} passHref>
              <Button colorClass="btn-secondary" variantClass="btn-outline">
                Live demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-8 lg:mt-0 select-none">
          <RequestsOverview
            timeFrame={timeFrame}
            origin={origin}
            metrics={metrics}
            loading={loading}
          />
        </div>
      </div>
    </div>
  </div>
);
