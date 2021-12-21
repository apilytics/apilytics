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
    title: 'Extensive metrics',
    content:
      'Compare the usage of your endpoints from all sources and gather time-series data across all of your APIs.',
  },
  {
    icon: ClockIcon,
    title: 'Response times',
    content: 'Monitor response times from your endpoints and easily spot bottlenecks in your API.',
  },
  {
    icon: BellIcon,
    title: 'Smart alerts',
    content: 'Get automatic alerts when your API is slow or gains unexpected traffic.',
  },
  {
    icon: DocumentReportIcon,
    title: 'Reports',
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
  <div className="bg-white">
    <div className="container py-16 max-w-3xl">
      <div className="text-center animate-fade-in-top animation-delay-800">
        <h1 className="text-5xl text-secondary">
          See business-critical metrics across all of your APIs
        </h1>
        <h2 className="text-3xl text-primary mt-8">
          Our intuitive dashboard shows you real-time data from your APIs with a simple to setup
          middleware.
        </h2>
      </div>
      <div className="mt-16 grid gap-4 grid-cols-1 md:grid-cols-3 animate-fade-in-top animation-delay-800">
        {FEATURES.map(({ icon: Icon, title, content }) => (
          <div className="flex flex-col rounded-lg divide-y shadow-xl" key={title}>
            <div className="flex items-center p-4">
              <Icon className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-xl text-gray-500">{title}</h2>
            </div>
            <p className="text-secondary text-xl p-4">{content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
