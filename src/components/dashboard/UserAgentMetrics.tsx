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
import type { BrowserData, DeviceData, OSData, PlausibleEvents, UserAgentData } from 'types';

type CombinedUserAgentData = BrowserData | OSData | DeviceData;

const METRIC_TYPES = {
  browsers: 'browsers',
  os: 'os',
  devices: 'devices',
};

interface Props {
  data: UserAgentData;
}

export const UserAgentMetrics: React.FC<Props> = ({
  data: { browserData, osData, deviceData },
}) => {
  const plausible = usePlausible();
  const { setSelectedBrowser, setSelectedOs, setSelectedDevice } = useOrigin();
  const [metricType, setMetricType] = useState(METRIC_TYPES.browsers);
  const [activeTab, setActiveTab] = useState(METRIC_TYPES.browsers);
  const { handleOpenModal, handleCloseModal } = useModal();

  const sortData = (a: CombinedUserAgentData, b: CombinedUserAgentData): number =>
    b.requests - a.requests;

  const attributes = {
    browsers: {
      data: browserData.sort(sortData),
      dataKey: 'browser',
      emptyLabel: 'No browsers available.',
    },
    os: {
      data: osData.sort(sortData),
      dataKey: 'os',
      emptyLabel: 'No operating systems available.',
    },
    devices: {
      data: deviceData.sort(sortData),
      dataKey: 'device',
      emptyLabel: 'No devices available.',
    },
  };

  const { data, dataKey, emptyLabel } = attributes[metricType as keyof typeof attributes];

  const { data: modalData, dataKey: modalDataKey } =
    attributes[activeTab as keyof typeof attributes];

  const truncatedData = data.slice(0, 10);
  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(data.length);
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
    };

    const dispatcher = dispatchers[metricType as keyof typeof dispatchers];
    const key = keys[metricType as keyof typeof keys];
    const newState = data[key as keyof typeof data];

    if (typeof newState === 'string') {
      dispatcher(newState);
    }

    const events: Record<string, keyof PlausibleEvents> = {
      browser: 'browser-click',
      os: 'os-click',
      device: 'device-click',
    };

    plausible(events[metricType as keyof typeof events]);
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.userAgents);

    const events: Record<string, keyof PlausibleEvents> = {
      browser: 'show-all-browsers-click',
      os: 'show-all-operating-systems-click',
      device: 'show-all-devices-click',
    };

    plausible(events[metricType as keyof typeof events]);
  };

  const renderNoMetrics = !data.length && (
    <div className="flex flex-col justify-center items-center py-40">
      <p>{emptyLabel}</p>
    </div>
  );

  const renderLabels = (
    <BarValue formatter={(value?: string | number): string => formatCount(Number(value))} />
  );

  const renderMetrics = (
    <>
      <div className="grow flex">
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
          className="btn-sm btn-ghost"
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
      <div className="flex flex-wrap px-2 gap-4">
        <p className="text-white mr-auto">User agents</p>
        <div className="tabs">
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.browsers && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.browsers)}
          >
            Browsers
          </p>
          <p
            className={clsx('tab tab-bordered', metricType === METRIC_TYPES.os && 'tab-active')}
            onClick={(): void => setMetricType(METRIC_TYPES.os)}
          >
            OS
          </p>
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.devices && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.devices)}
          >
            Devices
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col grow">{renderNoMetrics || renderMetrics}</div>
      <Modal name={MODAL_NAMES.userAgents} mobileFullscreen>
        <div className="overflow-y-auto w-screen sm:w-auto sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="text-white pl-4">User agents</p>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="tabs px-6 my-2">
            <p
              className={clsx(
                'tab tab-bordered grow',
                activeTab === METRIC_TYPES.browsers && 'tab-active',
              )}
              onClick={(): void => setActiveTab(METRIC_TYPES.browsers)}
            >
              Browsers
            </p>
            <p
              className={clsx(
                'tab tab-bordered grow',
                activeTab === METRIC_TYPES.os && 'tab-active',
              )}
              onClick={(): void => setActiveTab(METRIC_TYPES.os)}
            >
              OS
            </p>
            <p
              className={clsx(
                'tab tab-bordered grow',
                activeTab === METRIC_TYPES.devices && 'tab-active',
              )}
              onClick={(): void => setActiveTab(METRIC_TYPES.devices)}
            >
              Devices
            </p>
          </div>
          <div className="overflow-y-auto px-4">
            <div className="grow flex">
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
