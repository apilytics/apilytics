import Image from 'next/image';
import React, { useState } from 'react';

const SNIPPETS = [
  {
    name: 'Node.js',
    image: '/framework-logos/nodejs-logo.svg',
  },
  {
    name: 'Next.js',
    image: '/framework-logos/nextjs-logo.png',
  },
  {
    name: 'Django',
    image: '/framework-logos/django-logo.svg',
  },
  {
    name: 'FastAPI',
    image: '/framework-logos/fastapi-logo.png',
  },
];

const getCodeSnippet = (framework: string): JSX.Element | null => {
  switch (framework) {
    case 'Node.js': {
      return (
        <pre className="overflow-hidden">
          {`$ npm install apilytics

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
          {`$ pip install apilytics

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
          {`$ npm install apilytics

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
          {`$ pip install apilytics

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
  const [selectedFramework, setSelectedFramework] = useState(SNIPPETS[0].name);

  return (
    <div className="bg-background bg-no-repeat bg-cover">
      <div className="bg-filter">
        <div className="container max-w-3xl py-16 animate-fade-in-top animation-delay-1200 text-secondary flex flex-col items-center">
          <h1 className="text-5xl text-white">
            Set up in <span className="text-primary">10 minutes</span>
          </h1>
          <div className="mt-12 text-left mx-auto max-w-3xl">
            <h2 className="text-3xl text-secondary">
              <span className="text-primary">1.</span> Sign up and get your API key.
            </h2>
            <h2 className="text-3xl text-secondary">
              <span className="text-primary">2.</span> Embed our open-source middleware.
            </h2>
            <h2 className="text-3xl text-secondary">
              <span className="text-primary">3.</span> Navigate to your dashboard & see your
              metrics.
            </h2>
          </div>
          <div className="mt-14 bg-gray-800 w-full max-w-3xl rounded-lg">
            <div className="p-4 flex flex-wrap space-x-4">
              {SNIPPETS.map(({ name, image }) => (
                <button
                  key={name}
                  className={`m-2 ${
                    selectedFramework === name ? 'border-b-2 border-b-primary' : ''
                  }`}
                  onClick={(): void => setSelectedFramework(name)}
                >
                  <Image
                    src={image}
                    layout="fixed"
                    width={60}
                    height={60}
                    objectFit="contain"
                    alt={name}
                    priority
                  />
                </button>
              ))}
            </div>
            <div className="p-4">{getCodeSnippet(selectedFramework)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
