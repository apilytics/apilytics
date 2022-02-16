import { ArrowsExpandIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { useState } from 'react';

import { BarValue } from 'components/dashboard/BarValue';
import { DashboardCard } from 'components/dashboard/DashboardCard';
import { LinkTick } from 'components/dashboard/LinkTick';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
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
  const { handleOpenModal, handleCloseModal } = useModal();

  const sortData = (a: CombinedUserAgentData, b: CombinedUserAgentData): number =>
    b.requests - a.requests;

  const attributes = {
    browsers: {
      data: browserData.sort(sortData),
      dataKey: 'browser',
      label: 'Browsers',
      emptyLabel: 'No browsers available.',
    },
    os: {
      data: osData.sort(sortData),
      dataKey: 'os',
      label: 'OS',
      emptyLabel: 'No operating systems available.',
    },
    devices: {
      data: deviceData.sort(sortData),
      dataKey: 'device',
      label: 'Devices',
      emptyLabel: 'No devices available.',
    },
  };

  const { data, dataKey, emptyLabel } = attributes[metricType];

  const { data: modalData, dataKey: modalDataKey } = attributes[activeTab];

  const truncatedData = data.slice(0, 10);
  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(modalData.length);
  const truncatedHeight = getHeight(truncatedData.length);

  const handleLabelClick = (data: CombinedUserAgentData): void => {
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

  const renderNoMetrics = !data.length && (
    <div className="flex flex-col items-center justify-center py-40">
      <p>{emptyLabel}</p>
    </div>
  );

  const renderLabels = (
    <BarValue formatter={(value?: string | number): string => formatCount(Number(value))} />
  );

  const renderMetrics = (
    <>
      <div className="flex grow">
        <VerticalBarChart
          height={truncatedHeight}
          data={truncatedData}
          dataKey="requests"
          secondaryDataKey={dataKey}
          onLabelClick={handleLabelClick}
          renderLabels={renderLabels}
          tick={<LinkTick />}
          label="Name"
          secondaryLabel="Requests"
        />
      </div>
      <div className="flex">
        <Button
          onClick={handleShowAllClick}
          className="btn-ghost btn-sm"
          endIcon={ArrowsExpandIcon}
          fullWidth="mobile"
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
      <div className="mt-4 flex grow flex-col">{renderNoMetrics || renderMetrics}</div>
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
                height={height}
                data={modalData}
                dataKey="requests"
                secondaryDataKey={modalDataKey}
                onLabelClick={handleLabelClick}
                renderLabels={renderLabels}
                tick={<LinkTick />}
                label="Name"
                secondaryLabel="Requests"
              />
            </div>
          </div>
          <div className="p-6" />
        </div>
      </Modal>
    </DashboardCard>
  );
};
