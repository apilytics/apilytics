import {
  BellIcon,
  ClockIcon,
  DatabaseIcon,
  DocumentReportIcon,
  LightBulbIcon,
  ServerIcon,
} from '@heroicons/react/solid';
import React from 'react';

const FEATURES = [
  {
    icon: LightBulbIcon,
    title: 'Compare sources',
    content:
      'Compare the usage of your routes from all sources and gather time-series data across all of your APIs and endpoints.',
  },
  {
    icon: ClockIcon,
    title: 'Response times',
    content: 'Monitor response times from your endpoints and easily spot bottlenecks in your API.',
  },
  {
    icon: BellIcon,
    title: 'Smart alerts',
    content:
      'Get automatic smart alerts to notify you when your API is slow or gains unexpected traffic.',
  },
  {
    icon: DocumentReportIcon,
    title: 'Email/Slack reports',
    content: 'Get automatic weekly email and Slack reports for your API metrics.',
  },
  {
    icon: DatabaseIcon,
    title: 'Your data',
    content: 'We value your privacy and will never expose your data to anyone else except you.',
  },
  {
    icon: ServerIcon,
    title: 'Open source',
    content: 'Our open-source libraries allow you to see exactly what data leaves your APIs.',
  },
];

export const Features: React.FC = () => (
  <div className="bg-white text-secondary">
    <div className="container py-16">
      <h1 className="text-5xl text-center animate-fade-in-top animation-delay-800">
        Comprehensive API metrics
      </h1>
      <h1 className="text-5xl mt-4 text-center text-primary animate-fade-in-top animation-delay-1200">
        All in one place
      </h1>
      <div className="mt-12 max-w-4xl mx-auto grid gap-4 grid-cols-1 md:grid-cols-3 animate-fade-in-top animation-delay-800">
        {FEATURES.map(({ icon: Icon, title, content }) => (
          <div className="flex flex-col rounded-lg divide-y shadow-lg border-secondary" key={title}>
            <div className="flex items-center p-4">
              <Icon className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-xl">{title}</h2>
            </div>
            <p className="text-secondary text-xl p-4">{content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
