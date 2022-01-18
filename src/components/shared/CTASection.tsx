import React from 'react';

import { Button } from 'components/shared/Button';
import { EmailListForm } from 'components/shared/EmailListForm';
import { staticRoutes } from 'utils/router';

export const CTASection: React.FC = () => (
  <div className="container py-4 sm:py-16 max-w-3xl">
    <div className="grid grid-cols-1 sm:grid-cols-2 justify-center">
      <div>
        <h3 className="text-white">Try Apilytics?</h3>
        <h3 className="text-primary">Start your free trial.</h3>
      </div>
      <div className="mt-8 sm:mt-0 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-end">
        <Button linkTo={staticRoutes.login} className="btn-primary" fullWidth="mobile">
          Get started
        </Button>
        <Button linkTo={staticRoutes.demo} className="btn-secondary btn-outline" fullWidth="mobile">
          Live demo
        </Button>
      </div>
    </div>
    <div className="mt-8 sm:mt-16 sm:flex sm:justify-center">
      <EmailListForm label="Keep me updated" />
    </div>
  </div>
);
