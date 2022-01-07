import clsx from 'clsx';
import React, { useState } from 'react';

const INTEGRATIONS = ['Node.js', 'Next.js', 'Django', 'FastAPI', 'BYOM'];

const getCodeSnippet = (framework: string): string => {
  switch (framework) {
    case 'Node.js': {
      return `
$ npm install apilytics

// In your code:
const express = require('express');
const Apilytics = require('apilytics');

const apilytics = Apilytics('<your_api_key>');
const app = express();

app.use(apilytics);`;
    }

    case 'Django': {
      return `
$ pip install apilytics

# In your code:
MIDDLEWARE = [
...
'apilytics',
]`;
    }

    case 'Next.js': {
      return `
$ npm install apilytics

// In your code:
import Apilytics from 'apilytics';

const apilytics = Apilytics('<your_api_key>');

async function handler(req, res) {
  ...
  apilytics(req, res);
  ...
};

export default handler;`;
    }

    case 'FastAPI': {
      return `
$ pip install apilytics

# In your code:
from fastapi import FastAPI
from apilytics import Apilytics

app = FastAPI()

app.add_middleware(Apilytics, api_key='<your_api_key>')`;
    }

    case 'BYOM': {
      return `
If your backend supports none of our open source middlewares,
you can still use Apilytics by implementing your own middleware.

Simply perform an HTTP request to
https://apilytics.io/api/v1/middleware
for all of the requests that you want to track with Apilytics.

The HTTP requests must have the following specs:

Method: POST

Headers:
- "Content-Type": "application/json"
- "X-API-Key": "<your_api_key>"

Body:
- "path": The path of the endpoint, e.g. "/api/v1/users".
- "method": The HTTP method of the request that you want to track.
- "timeMillis": The time in milliseconds that the request took to complete.

Note that your request should take place as a background job
in your API and thus not bottlenecking your API in any way.`;
    }

    default: {
      return '';
    }
  }
};

export const Setup: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState(INTEGRATIONS[0]);

  return (
    <div className="bg-background bg-no-repeat bg-cover">
      <div className="bg-filter">
        <div className="container max-w-3xl py-16 flex flex-col">
          <h1 className="text-5xl text-white">
            Set up in <span className="text-primary">10 minutes</span>
          </h1>
          <div className="mt-12">
            <ul className="steps steps-vertical">
              <li className="step step-primary">
                <h2 className="text-2xl text-left">Sign up & grab your API key.</h2>
              </li>
              <li className="step step-primary">
                <h2 className="text-2xl text-left">
                  Embed our open-source middleware to your backend.
                </h2>
              </li>
              <li className="step step-primary">
                <h2 className="text-2xl text-left">Start using your dashboard! 🚀</h2>
              </li>
            </ul>
          </div>
          <div className="mt-14 bg-base-100 w-full rounded-lg mockup-code">
            <div className="p-2 tabs tabs-boxed bg-inherit">
              {INTEGRATIONS.map((name) => (
                <p
                  key={name}
                  className={clsx('tab tab-lg', selectedFramework === name && 'tab-active')}
                  onClick={(): void => setSelectedFramework(name)}
                >
                  {name}
                </p>
              ))}
            </div>
            <div className="p-4">
              <pre className="overflow-hidden break-words">{getCodeSnippet(selectedFramework)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
