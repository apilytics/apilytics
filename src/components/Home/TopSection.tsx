import Image from 'next/image';
import React from 'react';

import { Button } from 'components/shared/Button';
import { MockRequestsTimeFrame } from 'components/shared/MockRequestsTimeFrame';
import { usePlausible } from 'hooks/usePlausible';
import { DESCRIPTION, EVENT_LOCATIONS } from 'utils/constants';
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

export const TopSection: React.FC = () => {
  const plausible = usePlausible();
  const eventOptions = { location: EVENT_LOCATIONS.PAGE_TOP };

  return (
    <div className="bg-background bg-cover bg-no-repeat">
      <div className="bg-filter">
        <div className="container grid grid-cols-1 gap-4 py-4 lg:grid-cols-2 lg:gap-8 lg:py-16">
          <div className="text-left">
            <h1 className="text-white">
              <span className="text-primary">API analytics</span>
              <br />
              made <span className="text-secondary">easy</span>
            </h1>
            <h5 className="mt-12 text-white">{DESCRIPTION}</h5>
            <h6 className="mt-12 text-white">Simple integration with any backend</h6>
            <div className="mt-8 flex flex-wrap gap-4 grayscale">
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
            <div className="mt-8 grid grid-cols-1 gap-4 lg:inline-grid lg:grid-cols-2">
              <Button
                linkTo={staticRoutes.register}
                onClick={(): void => plausible('register-click', eventOptions)}
                className="btn-primary"
              >
                Get started
              </Button>
              <Button
                linkTo={staticRoutes.demo}
                onClick={(): void => plausible('live-demo-click', eventOptions)}
                className="btn-outline btn-secondary"
              >
                Live demo
              </Button>
            </div>
          </div>
          <div className="mt-8 select-none lg:mt-0">
            <MockRequestsTimeFrame />
          </div>
        </div>
      </div>
    </div>
  );
};
