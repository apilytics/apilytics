import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { DESCRIPTION, TITLE } from 'utils';

const FRAMEWORKS_DATA = [
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

export const TopSection: React.FC = () => (
  <div className="bg-background bg-no-repeat bg-cover">
    <div className="bg-filter">
      <div className="container py-16 animate-fade-in-top animation-delay-400 grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="text-left">
          <h1 className="text-7xl text-white">
            {TITLE.split('APIs')[0]} <span className="text-primary">APIs</span>
          </h1>
          <h2 className="text-2xl text-secondary mt-12">{DESCRIPTION}</h2>
          <p className="text-secondary text-left mt-12">Integrates with:</p>
          <div className="flex flex-row flex-wrap space-x-4 grayscale">
            {FRAMEWORKS_DATA.map(({ name, image }) => (
              <div key={name}>
                <Image
                  src={image}
                  layout="fixed"
                  width={100}
                  height={100}
                  objectFit="contain"
                  alt={name}
                  priority
                />
              </div>
            ))}
          </div>
          <Link href="/signup" passHref>
            <button className="bg-primary rounded p-5 mt-12 text-2xl text-white w-full lg:w-auto">
              Sign me up!
            </button>
          </Link>
        </div>
        <div className="rounded-md overflow-hidden mt-8 lg:mt-0">
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
      </div>
    </div>
  </div>
);
