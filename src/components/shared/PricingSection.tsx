import React from 'react';

import { PricingCard } from 'components/shared/PricingCard';

export const PricingSection: React.FC = () => (
  <div id="pricing" className="container max-w-3xl py-4 lg:py-16">
    <h1 className="text-white">
      <span className="text-primary">Flexible pricing</span> with a
      <br />
      <span className="text-secondary">free trial</span>
    </h1>
    <h5 className="mt-8 text-white">
      All features available from the start.
      <br />
      No credit card required.
    </h5>
    <PricingCard />
  </div>
);
