import { ExclamationIcon, ShieldCheckIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';

import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { dynamicApiRoutes } from 'utils/router';
import type { OriginMetrics } from 'types';

type PackageInfo = {
  name: string;
  url: string;
  versionKey: string;
};

const APILYTICS_PACKAGES: {
  [identifier: string]: PackageInfo | undefined;
} = {
  'apilytics-node-core': {
    name: 'Node.js @apilytics/core',
    // Don't use registry.npmjs.org because of CORS protections.
    url: 'https://unpkg.com/@apilytics/core/package.json',
    versionKey: 'version',
  },
  'apilytics-node-express': {
    name: 'Node.js @apilytics/express',
    url: 'https://unpkg.com/@apilytics/express/package.json',
    versionKey: 'version',
  },
  'apilytics-node-next': {
    name: 'Node.js @apilytics/next',
    url: 'https://unpkg.com/@apilytics/next/package.json',
    versionKey: 'version',
  },
  'apilytics-python-core': {
    name: 'Python [core] apilytics',
    url: 'https://pypi.org/pypi/apilytics/json',
    versionKey: 'info.version',
  },
  'apilytics-python-django': {
    name: 'Python [django] apilytics',
    url: 'https://pypi.org/pypi/apilytics/json',
    versionKey: 'info.version',
  },
  'apilytics-python-fastapi': {
    name: 'Python [fastapi] apilytics',
    url: 'https://pypi.org/pypi/apilytics/json',
    versionKey: 'info.version',
  },
  'apilytics-python-flask': {
    name: 'Python [flask] apilytics',
    url: 'https://pypi.org/pypi/apilytics/json',
    versionKey: 'info.version',
  },
};

const isFirstVersionGreater = (first: string, second: string): boolean => {
  const firstArr = first.split('.').map((val) => Number(val));
  const secondArr = second.split('.').map((val) => Number(val));
  for (let i = 0; i < secondArr.length; i++) {
    if (firstArr[i] < (secondArr[i] ?? 0)) {
      return false;
    }
  }
  return true;
};

const getLatestVersion = async (packageInfo: PackageInfo): Promise<string> => {
  const res = await fetch(packageInfo.url);
  const json = await res.json();
  return packageInfo.versionKey.split('.').reduce((obj, key) => obj[key], json);
};

const noBreak = (text: string): string => text.replace(/ /g, '\u00a0');

export const VersionInfo: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const { slug } = useContext();
  const { data: apilyticsPackage } = useFetch<OriginMetrics['apilyticsPackage']>({
    url: slug ? dynamicApiRoutes.originMetricsVersion({ slug }) : undefined,
  });

  const packageInfo = apilyticsPackage && APILYTICS_PACKAGES[apilyticsPackage.identifier];

  useEffect(() => {
    if (packageInfo) {
      const fetchLatestVersion = async (): Promise<void> => {
        try {
          setLatestVersion(await getLatestVersion(packageInfo));
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            throw e;
          }
        }
      };
      void fetchLatestVersion();
    }
  }, [packageInfo]);

  if (!packageInfo || !latestVersion) {
    return null;
  }

  const isUpToDate = isFirstVersionGreater(apilyticsPackage.version, latestVersion);
  const tooltipNote = isUpToDate ? '(latest version)' : `(Note! v${latestVersion} available)`;

  const renderIcon = isUpToDate ? (
    <ShieldCheckIcon className="h-7 w-7 text-success" />
  ) : (
    <ExclamationIcon className="h-7 w-7 text-warning" />
  );

  return (
    <div
      className="tooltip"
      data-tip={`Integration: ${noBreak(
        `${packageInfo.name} v${apilyticsPackage.version}`,
      )} ${noBreak(tooltipNote)}`}
    >
      {renderIcon}
    </div>
  );
};
