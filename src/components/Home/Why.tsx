import { BadgeCheckIcon } from '@heroicons/react/solid';
import React from 'react';

const REASONS = [
  {
    title: 'Low code',
    content:
      'Existing tools require you to either build, deploy or maintain stuff. We solve all of these problems for you.',
  },
  {
    title: 'Ease of use',
    content:
      "You don't need a team of experts with Apilytics. We'll take care of everything for you.",
  },
  {
    title: 'Meaningful data',
    content: "We know what metrics API developers are interested in and we've got you covered.",
  },
  {
    title: 'Full automation',
    content: "Choose how to receive your data & get alerted. We'll take care of the rest.",
  },
  {
    title: 'Privacy first',
    content: 'Your privacy matters. Your data is stored within EU with 100% GDPR compliance.',
  },
  {
    title: 'Flexible pricing',
    content: 'Pay only for the data you use. No surprise fees. Cancel any time.',
  },
];

export const Why: React.FC = () => (
  <div className="bg-background bg-cover bg-no-repeat">
    <div className="bg-filter">
      <div className="container flex max-w-3xl flex-col py-4 lg:py-16">
        <h1 className="text-white">
          Why choose <span className="text-primary">Apilytics</span>?
        </h1>
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {REASONS.map(({ title, content }) => (
            <div className="card rounded-lg bg-base-100 p-4" key={title}>
              <div className="flex items-center">
                <BadgeCheckIcon className="mr-2 h-8 w-8 text-secondary" />
                <h6 className="text-white">{title}</h6>
              </div>
              <p className="mt-2 grow">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
