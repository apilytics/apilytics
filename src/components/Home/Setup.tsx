import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';

import { staticRoutes } from 'utils/router';

const INTEGRATIONS = ['Express.js', 'Next.js', 'Django', 'FastAPI', 'BYOM'];

const getCodeSnippet = (framework: string): JSX.Element | string => {
  switch (framework) {
    case 'Express.js': {
      return (
        <>
          <pre>$ yarn add @apilytics/express</pre>
          <pre className="mt-2">
            <code>
              {`// server.js

const { apilyticsMiddleware } = require('@apilytics/express');
const express = require('express');

const app = express();

app.use(apilyticsMiddleware(process.env.APILYTICS_API_KEY));`}
            </code>
          </pre>
        </>
      );
    }

    case 'Next.js': {
      return (
        <>
          <pre>$ yarn add @apilytics/next</pre>
          <pre className="mt-2">
            <code>
              {`// pages/api/my-route.js

import { withApilytics } from '@apilytics/next';

const handler = async (req, res) => {
  // ...
};

export default withApilytics(handler, process.env.APILYTICS_API_KEY);`}
            </code>
          </pre>
        </>
      );
    }

    case 'Django': {
      return (
        <>
          <pre>$ pip install apilytics</pre>
          <pre className="mt-2">
            <code>
              {`# settings.py

import os

APILYTICS_API_KEY = os.getenv("APILYTICS_API_KEY")

MIDDLEWARE = [
  "apilytics.django.ApilyticsMiddleware",
]`}
            </code>
          </pre>
        </>
      );
    }

    case 'FastAPI': {
      return (
        <>
          <pre>$ pip install apilytics</pre>
          <pre className="mt-2">
            <code>
              {`# main.py

import os

from apilytics.fastapi import ApilyticsMiddleware
from fastapi import FastAPI

app = FastAPI()

app.add_middleware(ApilyticsMiddleware, api_key=os.getenv("APILYTICS_API_KEY"))`}
            </code>
          </pre>
        </>
      );
    }

    case 'BYOM': {
      return (
        <pre>
          If your backend supports none of our open source middlewares,
          <br />
          we have tools to help you with creating your own middleware.
          <br />
          See our <Link href={staticRoutes.docs}>docs</Link> for more information.
        </pre>
      );
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
        <div className="container max-w-3xl py-4 lg:py-16 flex flex-col">
          <h1 className="text-white">
            Set up in <span className="text-primary">10 minutes</span>
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
          <div className="mt-4 bg-base-100 w-full rounded-lg mockup-code">
            <div className="px-4 tabs">
              {INTEGRATIONS.map((name) => (
                <p
                  key={name}
                  className={clsx('tab tab-bordered', selectedFramework === name && 'tab-active')}
                  onClick={(): void => setSelectedFramework(name)}
                >
                  {name}
                </p>
              ))}
            </div>
            <div className="p-4 text-primary">{getCodeSnippet(selectedFramework)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
