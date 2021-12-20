import { CheckCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from 'components';

const MIN_REQUESTS = 50_000;
const MAX_REQUESTS = 5_000_000;
const REQUESTS_STEP = 50_000;

const FEATURES = [
  '50 APIs',
  'Email support',
  'Automatic alerts',
  'Slack reports',
  'Unlimited users',
  'Full data retention',
  'Full data ownership',
];

export const Pricing: React.FC = () => {
  const [requests, setRequests] = useState(MIN_REQUESTS);
  const price = (requests * 0.0001).toFixed();

  const getRequestsDisplay = (): string => {
    if (requests < 1_000_000) {
      return `${requests / 1000}k`;
    } else {
      return `${(requests / 1_000_000).toFixed(2)}M`;
    }
  };

  const getPriceDisplay = (): string => {
    if (requests === MAX_REQUESTS) {
      return 'Contact us';
    } else if (requests === MIN_REQUESTS) {
      return 'Free';
    } else {
      return `$${price}/month`;
    }
  };

  return (
    <div className="bg-white text-secondary text-center">
      <div className="container max-w-3xl py-16 animate-fade-in-top animation-delay-1600">
        <h1 className="text-5xl">Flexible pricing with a free tier</h1>
        <h2 className="text-3xl text-primary mt-8">
          All features available from the start.
          <br />
          No credit card required.
        </h2>
        <div className="mt-16 bg-white rounded-lg p-4 shadow-xl">
          <div className="flex justify-between">
            <div className="text-left">
              <p className="text-xl text-secondary">Monthly requests</p>
              <p className="text-2xl font-bold text-primary">{getRequestsDisplay()}</p>
            </div>
            <div className="text-left">
              <p className="text-xl text-secondary">Your price</p>
              <p className="text-2xl font-bold text-primary">{getPriceDisplay()}</p>
            </div>
          </div>
          <input
            type="range"
            value={requests}
            onChange={({ target }): void => setRequests(Number(target.value))}
            min={MIN_REQUESTS}
            max={MAX_REQUESTS}
            step={REQUESTS_STEP}
            className="w-full mt-8 appearance-none bg-gray-200 rounded-lg"
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-8 text-secondary text-left leading-normal">
            {FEATURES.map((feature) => (
              <p className="flex items-center" key={feature}>
                <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> {feature}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <h1 className="text-5xl">Ready to boost your API metrics?</h1>
          <h2 className="text-3xl text-primary mt-8">Sign up for the beta.</h2>
          <Link href="/signup" passHref>
            <Button className="mt-8">Request access</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
