import { CheckCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { useState } from 'react';

import { usePlausible } from 'hooks/usePlausible';

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
  'Unlimited APIs',
  'Email support',
  'Automatic alerts',
  'Email reports',
  'Slack reports',
  'Unlimited users',
  'Full data retention',
  'Full data ownership',
  '1 month free',
];

export const PricingCard: React.FC = () => {
  const plausible = usePlausible();
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
    <div className="card mt-8 rounded-lg bg-base-100 p-4">
      <div className="flex flex-col justify-between sm:flex-row">
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
        className="range range-primary range-lg mt-8 w-full rounded-lg"
        onClick={(): void => plausible('pricing-slider-click')}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 text-left leading-normal md:grid-cols-3">
        {FEATURES.map((feature) => (
          <p className="flex items-center" key={feature}>
            <CheckCircleIcon className="mr-4 h-7 w-7 text-success" /> {feature}
          </p>
        ))}
      </div>
    </div>
  );
};
