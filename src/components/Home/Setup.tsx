import clsx from 'clsx';
import React, { useState } from 'react';

import { MDX } from 'components/shared/MDX';
import { usePlausible } from 'hooks/usePlausible';
import type { Snippet } from 'types';

interface Props {
  snippets: Snippet[];
}

export const Setup: React.FC<Props> = ({ snippets }) => {
  const plausible = usePlausible();
  const [selectedIntegration, setSelectedIntegration] = useState(snippets[0].name);
  const snippet = snippets.find(({ name }) => selectedIntegration === name);

  const handleTabClick = (name: string) => (): void => {
    setSelectedIntegration(name);
    plausible('setup-snippet-click', { value: name });
  };

  if (!snippet) {
    throw Error('Snippet not found!');
  }

  const { source } = snippet;

  return (
    <div className="bg-background bg-cover bg-no-repeat">
      <div className="bg-filter">
        <div className="container flex max-w-3xl flex-col py-4 lg:py-16">
          <h1 className="text-white">
            Set up in <span className="text-primary">5 minutes</span>
          </h1>
          <div className="mt-4">
            <ul className="steps steps-vertical">
              <li className="step step-primary">
                <h5 className="text-left text-white">Sign up & grab your API key.</h5>
              </li>
              <li className="step step-primary">
                <h5 className="text-left text-white">Install our open-source middleware.</h5>
              </li>
              <li className="step step-primary">
                <h5 className="text-left text-white">Start using your dashboard! 🚀</h5>
              </li>
            </ul>
          </div>
          <div className="mockup-code mt-4 w-full rounded-lg bg-base-100 pb-0">
            <div className="tabs px-4">
              {snippets.map(({ name }) => (
                <p
                  key={name}
                  className={clsx('tab tab-bordered', selectedIntegration === name && 'tab-active')}
                  onClick={handleTabClick(name)}
                >
                  {name}
                </p>
              ))}
            </div>
            <div className="p-4">
              <MDX source={source} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
