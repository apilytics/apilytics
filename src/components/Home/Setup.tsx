import clsx from 'clsx';
import { MDXRemote } from 'next-mdx-remote';
import React, { useState } from 'react';

import type { Snippet } from 'types';

interface Props {
  snippets: Snippet[];
}

export const Setup: React.FC<Props> = ({ snippets }) => {
  const [selectedIntegration, setSelectedIntegration] = useState(snippets[0].name);
  const snippet = snippets.find(({ name }) => selectedIntegration === name);

  if (!snippet) {
    throw Error('Snippet not found!');
  }

  const { source } = snippet;

  return (
    <div className="bg-background bg-no-repeat bg-cover">
      <div className="bg-filter">
        <div className="container max-w-3xl py-4 lg:py-16 flex flex-col">
          <h1 className="text-white">
            Set up in <span className="text-primary">5 minutes</span>
          </h1>
          <div className="mt-4">
            <ul className="steps steps-vertical">
              <li className="step step-primary">
                <h5 className="text-left">Sign up & grab your API key.</h5>
              </li>
              <li className="step step-primary">
                <h5 className="text-left">Install our open-source middleware.</h5>
              </li>
              <li className="step step-primary">
                <h5 className="text-left">Start using your dashboard! 🚀</h5>
              </li>
            </ul>
          </div>
          <div className="mt-4 bg-base-100 w-full rounded-lg mockup-code pb-0">
            <div className="px-4 tabs">
              {snippets.map(({ name }) => (
                <p
                  key={name}
                  className={clsx('tab tab-bordered', selectedIntegration === name && 'tab-active')}
                  onClick={(): void => setSelectedIntegration(name)}
                >
                  {name}
                </p>
              ))}
            </div>
            <div className="p-4">
              <MDXRemote {...source} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
