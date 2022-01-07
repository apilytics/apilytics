import { CheckCircleIcon } from '@heroicons/react/solid';
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
      <div className="container max-w-3xl py-16">
        <h1 className="text-5xl">Flexible pricing with a free trial</h1>
        <h2 className="text-3xl text-primary mt-8">
          All features available from the start.
          <br />
          No credit card required.
        </h2>
        <div className="mt-16 card rounded-lg p-4 shadow-2xl">
          <div className="flex justify-between">
            <div className="text-left">
              <p className="text-xl">Monthly requests</p>
              <p className="text-2xl font-bold text-primary">{getRequestsDisplay()}</p>
            </div>
            <div className="text-left">
              <p className="text-xl">Your price</p>
              <p className="text-2xl font-bold text-primary">{getPriceDisplay()}</p>
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
        <div className="mt-16 flex flex-col items-center">
          <h1 className="text-3xl">Ready to boost your API monitoring?</h1>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full lg:w-auto">
            <Link href={staticRoutes.login} passHref>
              <Button colorClass="btn-primary" fullWidth="mobile">
                Get started
              </Button>
            </Link>
            <Link href={staticRoutes.demo} passHref>
              <Button colorClass="btn-secondary" variantClass="btn-outline" fullWidth="mobile">
                See demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
