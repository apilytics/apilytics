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
    title: 'Simple setup',
    content:
      'You can literally get started in 10 minutes. Simple configuration with no domain expertise or maintenance needed.',
  },
  {
    icon: LightningBoltIcon,
    title: 'Powerful metrics',
    content:
      'Our insightful metrics will boost your API development by pointing out bottlenecks, trends and patterns in your APIs.',
  },
  {
    icon: BellIcon,
    title: 'Smart alerts',
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
    title: 'Your data',
    content:
      'Your data will never be accessible to anyone but you. Export and delete your data whenever you want.',
  },
  {
    icon: ServerIcon,
    title: 'Open source',
    content: 'Our open-source middlewares allow you to see exactly what data leaves your APIs.',
  },
];

export const Features: React.FC = () => (
  <div className="bg-base-200">
    <div className="container py-4 lg:py-16 max-w-3xl">
      <h1 className="text-white">
        It&lsquo;s time to stop being <span className="text-primary">blind</span> about your
        <br />
        <span className="text-secondary">API metrics</span>
      </h1>
      <h5 className="mt-8">
        Analyze real-time metrics from your APIs through an intuitive dashboard. Integrate to your
        backend with a simple to setup middleware.
      </h5>
      <div className="mt-16 grid gap-4 grid-cols-1 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, content, comingSoon }) => (
          <div className="card bg-base-100 rounded-lg p-4" key={title}>
            <div className="flex items-center">
              <Icon className="h-8 w-8 text-primary mr-2" />
              <h6>{title}</h6>
            </div>
            <p className="mt-2 grow">{content}</p>
            {comingSoon && <div className="badge badge-outline mt-4">Coming soon</div>}
          </div>
        ))}
      </div>
    </div>
  </div>
);
