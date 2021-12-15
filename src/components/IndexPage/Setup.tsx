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
    case 'Node.js':
    case 'Next.js': {
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
        <div className="container py-16 animate-fade-in-top animation-delay-1200 text-secondary flex flex-col items-center">
          <h1 className="text-5xl text-white">
            Set up in <span className="text-primary">10 minutes</span>
          </h1>
          <div className="mt-8 text-left mx-auto max-w-3xl">
            <h2 className="text-2xl text-secondary">
              <span className="text-primary">1.</span> Sign up and get your API key.
            </h2>
            <h2 className="text-2xl text-secondary">
              <span className="text-primary">2.</span> Embed our open-source middleware into your
              backend.
            </h2>
            <h2 className="text-2xl text-secondary">
              <span className="text-primary">3.</span> Kick back and start analyzing your API usage
              from our dashboard.
            </h2>
          </div>
          <div className="mt-8 bg-gray-800 border-primary w-full max-w-3xl rounded-lg divide-y divide-primary">
            <div className="p-4 flex space-x-4">
              {SNIPPETS.map(({ name, image }) => (
                <button
                  key={name}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    selectedFramework === name ? 'border-primary' : ''
                  }`}
                  onClick={(): void => setSelectedFramework(name)}
                >
                  <Image
                    src={image}
                    layout="fixed"
                    width={40}
                    height={40}
                    objectFit="contain"
                    alt={name}
                    priority
                  />{' '}
                  <span className="ml-2">{name}</span>
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
