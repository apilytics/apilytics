import React from 'react';

import { Button } from 'components/shared/Button';
import { EmailListForm } from 'components/shared/EmailListForm';
import { usePlausible } from 'hooks/usePlausible';
import { EVENT_LOCATIONS } from 'utils/constants';
import { staticRoutes } from 'utils/router';

export const CTASection: React.FC = () => {
  const plausible = usePlausible();
  const eventOptions = { location: EVENT_LOCATIONS.PAGE_BOTTOM };

  return (
    <div className="container py-4 sm:py-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-8">
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
            className="btn-secondary btn-outline"
            fullWidth
          >
            Live demo
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <EmailListForm />
      </div>
    </div>
  );
};
