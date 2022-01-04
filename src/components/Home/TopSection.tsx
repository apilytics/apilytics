import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { RequestsOverview } from 'components/Demo/RequestsOverview';
import { Button } from 'components/shared/Button';
import { MOCK_METRICS, MOCK_ORIGIN } from 'mocks';
import { DESCRIPTION, LAST_7_DAYS_VALUE } from 'utils/constants';
import { staticRoutes } from 'utils/router';

const FRAMEWORKS_DATA = [
  {
    name: 'Node.js',
    image: '/framework-logos/nodejs-logo.svg',
  },
  {
    name: 'Next.js',
    image: '/framework-logos/nextjs-logo.png',
  },
  {
    name: 'Django',
    image: '/framework-logos/django-logo.svg',
  },
  {
    name: 'FastAPI',
    image: '/framework-logos/fastapi-logo.png',
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
          <p className="text-left mt-12">Integrates with:</p>
          <div className="flex flex-row flex-wrap space-x-4 grayscale">
            {FRAMEWORKS_DATA.map(({ name, image }) => (
              <div key={name}>
                <Image
                  src={image}
                  layout="fixed"
                  width={120}
                  height={120}
                  objectFit="contain"
                  alt={name}
                  priority
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:inline-grid">
            <Link href={staticRoutes.login} passHref>
              <Button>Get started</Button>
            </Link>
            <Link href={staticRoutes.demo} passHref>
              <Button color="secondary" variant="outlined">
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
