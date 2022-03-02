import { ArrowsExpandIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { useState } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import type {
  BrowserData,
  DeviceData,
  OSData,
  PlausibleEvents,
  UserAgentData,
  ValueOf,
} from 'types';

type CombinedUserAgentData = BrowserData | OSData | DeviceData;

type ValuesOfUnion<T> = T extends T ? ValueOf<T> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeGet = <T extends Record<keyof any, any>>(
  obj: T,
  prop: string,
): ValuesOfUnion<T> | undefined => {
  if (Object.prototype.hasOwnProperty.call(obj, prop)) {
    return obj[prop];
  } else {
    return undefined;
  }
};

const METRIC_TYPES = {
  browsers: 'browsers',
  os: 'os',
  devices: 'devices',
} as const;

interface Props {
  data: UserAgentData;
}

export const UserAgentMetrics: React.FC<Props> = ({
  data: { browserData, osData, deviceData },
}) => {
  const plausible = usePlausible();
  const { setSelectedBrowser, setSelectedOs, setSelectedDevice } = useOrigin();
  const [metricType, setMetricType] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.browsers);
  const [activeTab, setActiveTab] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.browsers);
  const { handleOpenModal, handleCloseModal } = useUIState();

  const sortData = (a: CombinedUserAgentData, b: CombinedUserAgentData): number =>
    b.requests - a.requests;

  const _renderLabel = (label: string): JSX.Element => (
    <a className="unstyled text-white hover:text-primary">
      <span className="link">{label}</span>
    </a>
  );

  const attributes = {
    browsers: {
      data: browserData.sort(sortData),
      renderLabel: ({ browser = '' }: Partial<BrowserData>) => _renderLabel(browser),
      label: 'Browsers',
    },
    os: {
      data: osData.sort(sortData),
      renderLabel: ({ os = '' }: Partial<OSData>) => _renderLabel(os),
      label: 'OS',
    },
    devices: {
      data: deviceData.sort(sortData),
      renderLabel: ({ device = '' }: Partial<DeviceData>) => _renderLabel(device),
      label: 'Devices',
    },
  };

  const { data, renderLabel } = attributes[metricType];
  const { data: modalData, renderLabel: renderModalLabel } = attributes[activeTab];
  const truncatedData = data.slice(0, 10);

  const handleBarClick = (data: Partial<BrowserData & OSData & DeviceData>): void => {
    const dispatchers = {
      browsers: setSelectedBrowser,
      os: setSelectedOs,
      devices: setSelectedDevice,
    };

    const keys = {
      browsers: 'browser',
      os: 'os',
      devices: 'device',
    } as const;

    const key = keys[metricType];
    const newState = safeGet(data, key);

    if (typeof newState === 'string') {
      const dispatcher = dispatchers[metricType];
      dispatcher(newState);
    }

    const events: Record<string, keyof PlausibleEvents> = {
      browser: 'browser-click',
      os: 'os-click',
      device: 'device-click',
    };

    plausible(events[metricType]);
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.userAgents);

    const events: Record<string, keyof PlausibleEvents> = {
      browser: 'show-all-browsers-click',
      os: 'show-all-operating-systems-click',
      device: 'show-all-devices-click',
    };

    plausible(events[metricType]);
  };

  const renderValue = ({ requests }: Partial<CombinedUserAgentData>): string =>
    formatCount(requests);

  const barChartProps = {
    data: truncatedData,
    valueKey: 'requests',
    renderLabel,
    renderValue,
    onBarClick: handleBarClick,
    leftLabel: 'Name',
    rightLabel: 'Requests',
  } as const;

  const renderMetrics = (
    <>
      <div className="flex grow">
        <VerticalBarChart {...barChartProps} />
      </div>
      <div className="flex">
        <Button
          onClick={handleShowAllClick}
          className="btn-ghost btn-sm"
          endIcon={ArrowsExpandIcon}
        >
          Show all ({formatCount(data.length)})
        </Button>
      </div>
    </>
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">User agents</p>
        <div className="tabs">
          {Object.values(METRIC_TYPES).map((type) => (
            <p
              className={clsx(
                'tab tab-bordered',
                metricType === METRIC_TYPES[type] && 'tab-active',
              )}
              onClick={(): void => setMetricType(METRIC_TYPES[type])}
              key={type}
            >
              {attributes[type].label}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-4 flex grow flex-col">{renderMetrics}</div>
      <Modal name={MODAL_NAMES.userAgents} mobileFullscreen>
        <div className="w-screen overflow-y-auto sm:w-auto sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="pl-4 text-white">User agents</p>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="tabs my-2 px-6">
            {Object.values(METRIC_TYPES).map((type) => (
              <p
                className={clsx(
                  'tab tab-bordered grow',
                  activeTab === METRIC_TYPES[type] && 'tab-active',
                )}
                onClick={(): void => setActiveTab(METRIC_TYPES[type])}
                key={type}
              >
                {attributes[type].label}
              </p>
            ))}
          </div>
          <div className="overflow-y-auto px-4">
            <div className="flex grow">
              <VerticalBarChart
                {...barChartProps}
                data={modalData}
                renderLabel={renderModalLabel}
              />
            </div>
          </div>
          <div className="p-6" />
        </div>
      </Modal>
    </DashboardCard>
  );
};
