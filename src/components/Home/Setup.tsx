import clsx from 'clsx';
import React, { useState } from 'react';

const FRAMEWORKS = ['Node.js', 'Next.js', 'Django', 'FastAPI'];

const getCodeSnippet = (framework: string): JSX.Element | null => {
  switch (framework) {
    case 'Node.js': {
      return (
        <pre className="overflow-hidden">
          {`
$ npm install apilytics

// In your code:
const express = require('express');
const Apilytics = require('apilytics');

const apilytics = Apilytics('<your_api_key>');
const app = express();

app.use(apilytics);`}
        </pre>
      );
    }

    case 'Django': {
      return (
        <pre className="overflow-hidden">
          {`
$ pip install apilytics

# In your code:
MIDDLEWARE = [
...
'apilytics',
]`}
        </pre>
      );
    }

    case 'Next.js': {
      return (
        <pre className="overflow-hidden">
          {`
$ npm install apilytics

// In your code:
import Apilytics from 'apilytics';

const apilytics = Apilytics('<your_api_key>');

async function handler(req, res) {
  ...
  apilytics(req, res);
  ...
};

export default handler;`}
        </pre>
      );
    }

    case 'FastAPI': {
      return (
        <pre className="overflow-hidden">
          {`
$ pip install apilytics

# In your code:
from fastapi import FastAPI
from apilytics import Apilytics

app = FastAPI()

app.add_middleware(Apilytics, api_key='<your_api_key>')`}
        </pre>
      );
    }

    default: {
      return null;
    }
  }
};

export const Setup: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);

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
                  Embed our open-source middleware to your code.
                </h2>
              </li>
              <li className="step step-primary">
                <h2 className="text-2xl text-left">Start using your dashboard! 🚀</h2>
              </li>
            </ul>
          </div>
          <div className="mt-14 bg-base-100 w-full rounded-lg mockup-code">
            <div className="p-2 tabs tabs-boxed bg-inherit">
              {FRAMEWORKS.map((name) => (
                <p
                  key={name}
                  className={clsx('tab tab-lg', selectedFramework === name && 'tab-active')}
                  onClick={(): void => setSelectedFramework(name)}
                >
                  {name}
                </p>
              ))}
            </div>
            <div className="p-4">{getCodeSnippet(selectedFramework)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
