import React from 'react';

import { Button } from 'components/shared/Button';
import { EmailListForm } from 'components/shared/EmailListForm';
import { FeatureCard } from 'components/shared/FeatureCard';
import { usePlausible } from 'hooks/usePlausible';
import { EVENT_LOCATIONS } from 'utils/constants';
import { staticRoutes } from 'utils/router';

export const CTASection: React.FC = () => {
  const plausible = usePlausible();
  const eventOptions = { location: EVENT_LOCATIONS.PAGE_BOTTOM };

  return (
    <div className="container max-w-3xl py-4 sm:py-8">
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="grow">
          <h3 className="text-white">Would you like to try Apilytics?</h3>
          <h3 className="text-primary">Start a free trial now.</h3>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            linkTo={staticRoutes.register}
            onClick={(): void => plausible('register-click', eventOptions)}
            className="btn-primary"
            fullWidth
          >
            Get started
          </Button>
          <Button
            linkTo={staticRoutes.demo}
            onClick={(): void => plausible('live-demo-click', eventOptions)}
            className="btn-outline btn-secondary"
            fullWidth
          >
            Live demo
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <EmailListForm />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FeatureCard
          title="Ease of use"
          href={staticRoutes.easeOfUse}
          text="API monitoring doesn't have to be hard. Unfortunately with the most tools out there, that is the case though. Apilytics is here to fix that. Our 5-minute installation is one of the corner stones why you should pick Apilytics."
        />
        <FeatureCard
          title="Lightweight"
          href={staticRoutes.lightweight}
          text="Apilytics middlewares are super lightweight, fast and they will cause no performance impact on your APIs whatsoever."
        />
        <FeatureCard
          title="Privacy-friendly"
          href={staticRoutes.privacyFriendly}
          text="Our privacy-friendly approach lets you be in control of your data, making Apilytics a great fit for anyone aware of their privacy. Our open source middlewares allow you to see exactly what data leaves your servers."
        />
        <FeatureCard
          title="Open source"
          href={staticRoutes.openSource}
          text="We want to be transparent on how we process the data of our users. This is why we have open sourced 100% of our client middleware code, keeping our users updated on what data from their API is processed."
        />
      </div>
    </div>
  );
};
