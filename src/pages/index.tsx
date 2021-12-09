import {
  BellIcon,
  ClockIcon,
  DatabaseIcon,
  DocumentReportIcon,
  LightBulbIcon,
  SearchIcon,
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
            <SearchIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white my-4">Compare sources</h2>
            <p className="text-secondary text-xl">
              Does your API support multiple clients? Compare the usage of your routes from all
              sources.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <DatabaseIcon className="h-14 w-14 text-primary" />
            <h2 className="text-2xl text-white mt-4">Your data</h2>
            <p className="text-secondary text-xl">
              We value your privacy and will never use or expose your data to anyone else except
              you.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-16 animate-fade-in-top animation-delay-1600">
        <h1 className="text-5xl">
          Transparent pricing based on <span className="text-primary">usage</span>
        </h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mt-16">
          <div className="bg-white rounded-lg p-4 outline-primary flex flex-col justify-between">
            <div>
              <h2 className="text-3xl text-primary mb-4">Free</h2>
              <ul className="text-left">
                <li className="text-secondary">10k requests/month</li>
                <li className="text-secondary">Route-specific metrics</li>
                <li className="text-secondary">Basic support</li>
              </ul>
            </div>
            <div className="mt-6 bg-primary rounded p-2">
              <h3 className="text-xl text-white">$9,99</h3>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 outline-primary flex flex-col justify-between">
            <div>
              <h2 className="text-3xl text-primary mb-4">Startup</h2>
              <ul className="text-left">
                <li className="text-secondary">20k requests/month</li>
                <li className="text-secondary">Route-specific metrics</li>
                <li className="text-secondary">Email support</li>
                <li className="text-secondary">Automatic alerts</li>
                <li className="text-secondary">Slack/email reports</li>
              </ul>
            </div>
            <div className="mt-6 bg-primary rounded p-2">
              <h3 className="text-xl text-white">$19,99</h3>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 outline-primary flex flex-col justify-between">
            <div>
              <h2 className="text-3xl text-primary mb-4">Business</h2>
              <ul className="text-left">
                <li className="text-secondary">50k requests/month</li>
                <li className="text-secondary">Route-specific metrics</li>
                <li className="text-secondary">Email support</li>
                <li className="text-secondary">Automatic alerts</li>
                <li className="text-secondary">Slack/email reports</li>
              </ul>
            </div>
            <div className="mt-6 bg-primary rounded p-2">
              <h3 className="text-xl text-white">$49,99</h3>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 outline-primary flex flex-col justify-between">
            <div>
              <h2 className="text-3xl text-primary mb-4">Enterprise</h2>
              <ul className="text-left">
                <li className="text-secondary">+50k requests/month</li>
                <li className="text-secondary">Route-specific metrics</li>
                <li className="text-secondary">Email support</li>
                <li className="text-secondary">Automatic alerts</li>
                <li className="text-secondary">Slack/email reports</li>
                <li className="text-secondary">99,9% SLA</li>
              </ul>
            </div>
            <a href="mailto:hello@apilytics.io">
              <button className="mt-6 bg-primary rounded p-2 w-full">
                <h3 className="text-xl text-white">Contact us</h3>
              </button>
            </a>
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
