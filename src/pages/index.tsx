import {
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  DatabaseIcon,
  DocumentReportIcon,
  LightBulbIcon,
  ServerIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { Layout } from 'components';
import { DESCRIPTION, FRAMEWORKS_DATA, TITLE } from 'utils';

const MIN_REQUESTS = 50_000;
const MAX_REQUESTS = 5_000_000;
const REQUESTS_STEP = 50_000;

const Home: NextPage = () => {
  const [requests, setRequests] = useState(MIN_REQUESTS);
  const price = (requests * 0.0001).toFixed();

  const getRequestsDisplay = (): string => {
    if (requests < 1_000_000) {
      return `${requests / 1000}k`;
    } else {
      return `${(requests / 1_000_000).toFixed(2)}M`;
    }
  };

  const getPriceDisplay = (): string => {
    if (requests === MAX_REQUESTS) {
      return 'Contact us';
    } else {
      return `$${price}/month`;
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-16 animate-fade-in-top">
        <h1 className="text-5xl text-white">
          {TITLE.split('API')[0]} <span className="text-primary">API</span>
        </h1>
        <h2 className="text-2xl text-secondary mt-8">{DESCRIPTION}</h2>
      </div>
      <div className="mt-8 animate-fade-in-top animation-delay-400 flex flex-col items-center">
        <Link href="/signup" passHref>
          <button className="bg-primary rounded p-4 mt-4 text-xl text-white sm:mt-0 sm:ml-1">
            Sign me up!
          </button>
        </Link>
      </div>
      <div className="rounded-md overflow-hidden mt-16 animate-fade-in-top animation-delay-800">
        <Image
          src="/mock-up.png"
          layout="responsive"
          // The original dimensions of the image are 2152x1824.
          // These dimensions are those divided by 4.
          // The ratio must remain the same as the original image.
          // We cannot use objectFit="contain" here as it breaks the rounded corners of the image.
          width={538}
          height={456}
          alt="Mock-up of the app"
          priority
        />
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-1200">
        <h1 className="text-5xl text-white">
          Centralized metrics for your <span className="text-primary">backend</span>
        </h1>
        <div className="mt-16 grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <LightBulbIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">Route-specific metrics</h2>
            <p className="text-secondary text-xl">
              Compare the usage of your routes from all sources. Gather time-series data for each
              endpoint.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ClockIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">Response times</h2>
            <p className="text-secondary text-xl">
              Track response times from your endpoints. See averages and spot bottlenecks in your
              API.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <BellIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">Smart alerts</h2>
            <p className="text-secondary text-xl">
              Configure smart alerts to notify you when your API is slow or gains unexpected
              traffic.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <DocumentReportIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">Email/Slack reports</h2>
            <p className="text-secondary text-xl">
              Get automatic weekly email and Slack reports for your API metrics.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <DatabaseIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">Your data</h2>
            <p className="text-secondary text-xl">
              We value your privacy and will never expose your data to anyone else except you.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ServerIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">API first</h2>
            <p className="text-secondary text-xl">
              Access all of your raw data via our public API and do anything with it.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-1600">
        <h1 className="text-5xl text-white">
          Integrates with the most popular <span className="text-primary">frameworks</span>
        </h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mt-16 justify-items-center">
          {FRAMEWORKS_DATA.map(({ name, image }) => (
            <Image
              src={image}
              layout="fixed"
              width={150}
              height={150}
              objectFit="contain"
              alt={name}
              key={name}
              priority
            />
          ))}
        </div>
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-2000 flex flex-col items-center">
        <h1 className="text-5xl text-white">
          Trivially <span className="text-primary">simple</span> setup
        </h1>
        <div className="mt-8 text-left">
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
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-2400">
        <h1 className="text-5xl text-white">
          Flexible pricing with a <span className="text-primary">free trial</span>
        </h1>
        <h2 className="text-2xl text-secondary mt-8">
          Try Apilytics for free and upgrade based on your monthly requests.{' '}
          <span className="text-white">Everything will be free for the beta users!</span>
        </h2>
        <div className="mt-8 bg-white rounded-lg p-4 border-primary">
          <div className="flex justify-between">
            <div className="text-left">
              <p className="text-xl text-secondary">Monthly requests</p>
              <p className="text-2xl font-bold text-primary">{getRequestsDisplay()}</p>
            </div>
            <div className="text-left">
              <p className="text-xl text-secondary">Your price</p>
              <p className="text-2xl font-bold text-primary">{getPriceDisplay()}</p>
            </div>
          </div>
          <input
            type="range"
            value={requests}
            onChange={({ target }): void => setRequests(Number(target.value))}
            min={MIN_REQUESTS}
            max={MAX_REQUESTS}
            step={REQUESTS_STEP}
            className="w-full mt-8 appearance-none bg-primary rounded-lg"
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-8 text-secondary text-left leading-normal">
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> 50 APIs
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Email support
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Automatic alerts
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Email/Slack reports
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Unlimited team members
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> Unlimited data retention
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> 100% data ownership
            </p>
            <p className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-4 text-primary" /> 1 month free
            </p>
          </div>
        </div>
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-2800">
        <h1 className="text-5xl text-white">
          Ready to boost your API <span className="text-primary">metrics</span>?
        </h1>
        <h2 className="text-2xl text-secondary mt-8">Sign up to join the free beta!</h2>
        <Link href="/signup" passHref>
          <button className="mt-8 bg-primary rounded p-4 text-xl text-white">Get started</button>
        </Link>
      </div>
    </Layout>
  );
};

export default Home;
