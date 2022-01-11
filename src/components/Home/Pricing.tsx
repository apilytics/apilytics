import { CheckCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import { staticRoutes } from 'utils/router';

const PRICES = {
  50_000: 5,
  200_000: 10,
  500_000: 20,
  1_000_000: 40,
  2_000_000: 60,
  3_000_000: 80,
  5_000_000: 100,
  10_000_000: 150,
  20_000_000: 200,
};

const FEATURES = [
  '50 origins',
  'Email support',
  'Automatic alerts',
  'Automatic reports',
  'Unlimited users',
  'Full data retention',
  'Full data ownership',
  '1 month free',
];

export const Pricing: React.FC = () => {
  const [step, setStep] = useState(1);
  const requestOptions = Object.keys(PRICES).map(Number);
  const requests = requestOptions[step - 1];
  const customRequests = requests === undefined;
  const price = PRICES[requests as keyof typeof PRICES];

  const getRequestsDisplay = (): string => {
    if (customRequests) {
      return 'Custom';
    }

    if (requests < 1_000_000) {
      return `${(requests / 1000).toFixed()}k`;
    }

    return `${(requests / 1_000_000).toFixed()}M`;
  };

  const getPriceDisplay = (): string => {
    if (customRequests) {
      return 'Contact us';
    }

    return `$${price}/month`;
  };

  return (
    <div className="bg-base-200">
      <div className="container max-w-3xl py-4 lg:py-16">
        <h1 className="text-white">
          <span className="text-primary">Flexible pricing</span> with a
          <br />
          <span className="text-secondary">free trial</span>
        </h1>
        <h5 className="mt-8">
          All features available from the start.
          <br />
          No credit card required.
        </h5>
        <div className="mt-8 card bg-base-100 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="text-left">
              <h6>Monthly requests</h6>
              <h3 className="font-bold text-primary">{getRequestsDisplay()}</h3>
            </div>
            <div className="text-left sm:text-right">
              <h6>Your price</h6>
              <h3 className={clsx('font-bold text-primary', !customRequests && 'line-through')}>
                {getPriceDisplay()}
              </h3>
              {!customRequests && <p>Free during beta</p>}
            </div>
          </div>
          <input
            type="range"
            value={step}
            onChange={({ target }): void => setStep(Number(target.value))}
            min={1}
            max={requestOptions.length + 1}
            step={1}
            className="range range-primary range-lg w-full mt-8 rounded-lg"
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-8 text-left leading-normal">
            {FEATURES.map((feature) => (
              <p className="flex items-center" key={feature}>
                <CheckCircleIcon className="h-7 w-7 mr-4 text-success" /> {feature}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-white">
            Ready to <span className="text-primary">boost</span> your API development?
          </h3>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full lg:w-auto">
            <Link href={staticRoutes.login} passHref>
              <Button className="btn-primary" fullWidth="mobile">
                Get started
              </Button>
            </Link>
            <Link href={staticRoutes.demo} passHref>
              <Button className="btn-secondary btn-outline" fullWidth="mobile">
                See demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
