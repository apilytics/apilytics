import React from 'react';

import { Button } from 'components/shared/Button';
import { staticRoutes } from 'utils/router';

export const BottomSection: React.FC = () => (
  <div className="bg-base-200">
    <div className="container py-4 lg:py-16 max-w-3xl text-center">
      <h3 className="text-white">
        Ready to <span className="text-primary">boost</span> your API development?
      </h3>
      <div className="mt-8 flex flex-col lg:flex-row gap-4 justify-center">
        <Button linkTo={staticRoutes.login} className="btn-primary" fullWidth="mobile">
          Get started
        </Button>
        <Button linkTo={staticRoutes.demo} className="btn-secondary btn-outline" fullWidth="mobile">
          Live demo
        </Button>
      </div>
    </div>
  </div>
);
