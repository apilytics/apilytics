import {
  BellIcon,
  ClockIcon,
  DatabaseIcon,
  DocumentReportIcon,
  LightBulbIcon,
  ServerIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';
import { useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { Layout } from 'components';
import { DESCRIPTION, FRAMEWORKS_DATA, TITLE } from 'utils';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [_emailError, setEmailError] = useState('');
  const [_loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const unexpectedEmailError = 'Unexpected error.';

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 201) {
        setEmail('');
        setEmailError('');
      } else {
        setEmailError(message || unexpectedEmailError);
      }
    } catch {
      setEmailError(unexpectedEmailError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-16 animate-fade-in-top">
        <h1 className="text-5xl">
          {TITLE.split('API')[0]} <span className="text-primary">API</span>
        </h1>
        <h2 className="text-2xl text-secondary mt-8">{DESCRIPTION}</h2>
      </div>
      <div className="mt-8 animate-fade-in-top animation-delay-400">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label htmlFor="email" className="text-2xl mb-2 text-secondary">
            Sign up, and be the first to access the free beta!
          </label>
          <div className="mt-2 flex flex-col sm:flex-row">
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={({ target }): void => setEmail(target.value)}
              placeholder="Your email"
              required
              autoFocus
              className="outline-primary rounded text-xl p-4"
            />
            <button
              type="submit"
              className="bg-primary rounded p-4 text-xl text-white mt-1 sm:mt-0 sm:ml-1"
            >
              Sign me up!
            </button>
          </div>
        </form>
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
        <h1 className="text-5xl">
          Trivially <span className="text-primary">simple</span> setup
        </h1>
        <div className="flex flex-col items-center mt-8">
          <p className="text-secondary text-xl">Sign up for Apilytics and get your API key.</p>
          <p className="text-secondary text-xl">
            Embed our open-source, framework specific middleware into your backend.
          </p>
          <p className="text-secondary text-xl">
            Kick back and start visualizing your API usage from our dashboard.
          </p>
        </div>
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-1200">
        <h1 className="text-5xl">
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
      <div className="mt-16 animate-fade-in-top animation-delay-2000">
        <h1 className="text-5xl">
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
      <div className="mt-16 animate-fade-in-top animation-delay-2400">
        <h1 className="text-5xl">
          Usable free-tier and <span className="text-primary">flexible</span> usage based pricing
          plan
        </h1>
        <p className="mt-8 text-xl text-secondary">
          Try Apilytics with the forgiving free-tier and upgrade to paid plans only after your
          application gains traction.{' '}
          <span className="text-white">Everything will be free during our beta period!</span>
        </p>
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-2400">
        <h1 className="text-5xl">
          Ready to boost your API <span className="text-primary">metrics</span>?
        </h1>
        <button
          onClick={(): void => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-16 bg-primary rounded p-4 text-xl text-white"
        >
          Get started
        </button>
      </div>
    </Layout>
  );
};

export default Home;
