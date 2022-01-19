import Image from 'next/image';
import React from 'react';

import { Button } from 'components/shared/Button';
import { MockRequestsOverview } from 'components/shared/MockRequestsOverview';
import { DESCRIPTION } from 'utils/constants';
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

export const TopSection: React.FC = () => (
  <div className="bg-background bg-no-repeat bg-cover">
    <div className="bg-filter">
      <div className="container py-4 lg:py-16 grid gap-4 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="text-left">
          <h1 className="text-white">
            <span className="text-primary">API analytics</span>
            <br />
            made <span className="text-secondary">easy</span>
          </h1>
          <h5 className="mt-12 text-white">{DESCRIPTION}</h5>
          <h6 className="mt-12 text-white">Simple integration with any backend</h6>
          <div className="flex flex-wrap gap-4 mt-8 grayscale">
            {INTEGRATIONS.map(({ name, image }) => (
              <div key={name}>
                <Image
                  src={image}
                  layout="fixed"
                  width={60}
                  height={60}
                  quality={1}
                  objectFit="contain"
                  alt={name}
                  priority
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:inline-grid mt-8">
            <Button linkTo={staticRoutes.login} className="btn-primary">
              Get started
            </Button>
            <Button linkTo={staticRoutes.demo} className="btn-secondary btn-outline">
              Live demo
            </Button>
          </div>
        </div>
        <div className="mt-8 lg:mt-0 select-none">
          <MockRequestsOverview />
        </div>
      </div>
    </div>
  </div>
);
