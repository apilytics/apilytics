import { CheckCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useState } from 'react';

const MIN_REQUESTS = 50_000;
const MAX_REQUESTS = 5_000_000;
const REQUESTS_STEP = 50_000;

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
    } else {
      return `$${price}/month`;
    }
  };

  return (
    <div className="bg-white text-secondary text-center">
      <div className="container py-16 animate-fade-in-top animation-delay-1600">
        <h1 className="text-5xl">
          Flexible pricing with a <span className="text-primary">free trial</span>
        </h1>
        <div className="mt-8 bg-white rounded-lg p-4 shadow-lg border-secondary max-w-3xl mx-auto">
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
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> 50 APIs
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Email support
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Automatic alerts
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Email/Slack reports
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Unlimited team members
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Unlimited data retention
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> 100% data ownership
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> 1 month free
            </p>
          </div>
        </div>
        <h1 className="text-5xl mt-16">
          Ready to boost your <span className="text-primary">API metrics</span>?
        </h1>
        <h2 className="text-2xl text-secondary mt-8">Sign up for the free beta!</h2>
        <Link href="/signup" passHref>
          <button className="bg-primary rounded p-5 mt-8 text-2xl text-white w-full lg:w-auto">
            Get started
          </button>
        </Link>
      </div>
    </div>
  );
};
