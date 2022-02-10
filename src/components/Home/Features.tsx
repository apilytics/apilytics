import {
  BellIcon,
  DatabaseIcon,
  DocumentReportIcon,
  LightBulbIcon,
  LightningBoltIcon,
  ServerIcon,
} from '@heroicons/react/solid';
import React from 'react';

const FEATURES = [
  {
    icon: LightBulbIcon,
    title: 'Simple Setup',
    content:
      'You can literally get started in 5 minutes. Simple configuration with no domain expertise or maintenance needed.',
  },
  {
    icon: LightningBoltIcon,
    title: 'Powerful Metrics',
    content:
      'Our insightful metrics will boost your API development by pointing out bottlenecks, trends and patterns in your APIs.',
  },
  {
    icon: BellIcon,
    title: 'Smart Alerts',
    content: 'Get automatic alerts when your API faces unexpected events, like traffic spikes.',
    comingSoon: true,
  },
  {
    icon: DocumentReportIcon,
    title: 'Reports',
    content: 'Get automatic weekly email and Slack reports for your API metrics.',
    comingSoon: true,
  },
  {
    icon: DatabaseIcon,
    title: 'Your Data',
    content:
      'Your data will never be accessible to anyone but you. Export and delete your data whenever you want.',
  },
  {
    icon: ServerIcon,
    title: 'Open Source',
    content: 'Our open-source middlewares allow you to see exactly what data leaves your APIs.',
  },
];

export const Features: React.FC = () => (
  <div className="container max-w-3xl py-4 lg:py-16">
    <h1 className="text-white">
      It's time to stop being <span className="text-primary">blind</span> about your
      <br />
      <span className="text-secondary">application metrics</span>
    </h1>
    <h5 className="mt-8">
      Analyze real-time metrics from your APIs through an intuitive dashboard. Simple middleware
      configuration and no installable host-agents. Works in any environment with no performance
      overhead to your application.
    </h5>
    <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, content, comingSoon }) => (
        <div className="card rounded-lg bg-base-100 p-4" key={title}>
          <div className="flex items-center">
            <Icon className="mr-2 h-8 w-8 text-primary" />
            <h6 className="text-white">{title}</h6>
          </div>
          <p className="mt-2 grow">{content}</p>
          {comingSoon && <div className="badge badge-outline mt-4">Coming soon</div>}
        </div>
      ))}
    </div>
  </div>
);
