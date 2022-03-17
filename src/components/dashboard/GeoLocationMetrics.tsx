import { ArrowsExpandIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { useState } from 'react';
import type { ReactNode } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { ExternalLink } from 'components/shared/ExternalLink';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES } from 'utils/constants';
import { getFlagEmoji } from 'utils/helpers';
import { formatCount } from 'utils/metrics';
import type {
  CityData,
  CountryData,
  GeoLocationData,
  PlausibleEvents,
  RegionData,
  ValueOf,
} from 'types';

type CombinedGeoLocationData = CountryData | RegionData | CityData;

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
  countries: 'countries',
  regions: 'regions',
  cities: 'cities',
} as const;

interface Props {
  data: GeoLocationData;
}

export const GeoLocationMetrics: React.FC<Props> = ({
  data: { countryData, regionData, cityData },
}) => {
  const plausible = usePlausible();
  const { setSelectedCountry, setSelectedCountryCode, setSelectedRegion, setSelectedCity } =
    useOrigin();

  const [metricType, setMetricType] = useState<ValueOf<typeof METRIC_TYPES>>(
    METRIC_TYPES.countries,
  );

  const [activeTab, setActiveTab] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.countries);
  const { handleOpenModal, handleCloseModal } = useUIState();

  const sortData = (a: CombinedGeoLocationData, b: CombinedGeoLocationData): number =>
    b.requests - a.requests;

  const _renderLabel = ({
    countryCode = '',
    label,
  }: {
    countryCode: string | null;
    label: string;
  }): JSX.Element => {
    const renderLabel = <span className="link">{label}</span>;

    const renderLinkWrapper = (children: ReactNode): JSX.Element => (
      <a className="unstyled text-white hover:text-primary">{children}</a>
    );

    if (countryCode) {
      return renderLinkWrapper(
        <>
          {getFlagEmoji(countryCode)} {renderLabel}
        </>,
      );
    }

    return renderLinkWrapper(renderLabel);
  };

  const attributes = {
    countries: {
      data: countryData.sort(sortData),
      renderLabel: ({ countryCode = '', country = '' }: Partial<CountryData>) =>
        _renderLabel({ countryCode, label: country }),
      label: 'Countries',
    },
    regions: {
      data: regionData.sort(sortData),
      renderLabel: ({ countryCode = '', region = '' }: Partial<RegionData>) =>
        _renderLabel({ countryCode, label: region }),
      label: 'Regions',
    },
    cities: {
      data: cityData.sort(sortData),
      renderLabel: ({ countryCode = '', city = '' }: Partial<CityData>) =>
        _renderLabel({ countryCode, label: city }),
      label: 'Cities',
    },
  };

  const { data, renderLabel } = attributes[metricType];
  const { data: _modalData, renderLabel: renderModalLabel } = attributes[activeTab];
  const truncatedData = data.slice(0, 10);
  const pageSize = 10;
  const pages = Math.ceil(_modalData.length / pageSize);
  const [page, setPage] = useState(0);
  const offset = page * pageSize;
  const paginatedModalData = _modalData.slice(offset, offset + pageSize);

  const handleBarClick = ({
    countryCode,
    ...data
  }: Partial<CountryData & RegionData & CityData>): void => {
    const dispatchers = {
      countries: setSelectedCountry,
      regions: setSelectedRegion,
      cities: setSelectedCity,
    };

    const keys = {
      countries: 'country',
      regions: 'region',
      cities: 'city',
    } as const;

    const key = keys[metricType];
    const newState = safeGet(data, key);

    if (typeof newState === 'string') {
      const dispatcher = dispatchers[metricType];
      dispatcher(newState);
    }

    if (typeof countryCode === 'string') {
      setSelectedCountryCode(countryCode);
    }

    const events: Record<string, keyof PlausibleEvents> = {
      country: 'country-click',
      region: 'region-click',
      city: 'city-click',
    };

    plausible(events[metricType]);
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.GEO_LOCATION);

    const events: Record<string, keyof PlausibleEvents> = {
      country: 'show-all-countries-click',
      region: 'show-all-regions-click',
      city: 'show-all-cities-click',
    };

    plausible(events[metricType]);
  };

  const renderValue = ({ requests }: Partial<CombinedGeoLocationData>): string =>
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
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={handleShowAllClick}
          className="btn-ghost btn-sm mr-auto"
          endIcon={ArrowsExpandIcon}
        >
          Show all ({formatCount(data.length)})
        </Button>
        <p className="text-sm">
          We never store or expose the IP addresses used to aggregate this data. IP geolocation by{' '}
          <ExternalLink href="https://db-ip.com">DB-IP</ExternalLink>.
        </p>
      </div>
    </>
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">{attributes[metricType].label}</p>
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
      <Modal name={MODAL_NAMES.GEO_LOCATION} mobileFullscreen>
        <div className="w-screen overflow-y-auto sm:w-auto sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="pl-4 text-white">{attributes[activeTab].label}</p>
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
                data={paginatedModalData}
                renderLabel={renderModalLabel}
              />
            </div>
          </div>
          <div className="flex justify-center p-4">
            <div className="btn-group">
              {page > 0 && (
                <button className="btn" onClick={(): void => setPage(0)}>
                  {1}
                </button>
              )}
              {page > 2 && <button className="btn-disabled btn">...</button>}
              {page > 1 && (
                <button className="btn" onClick={(): void => setPage(page - 1)}>
                  {page}
                </button>
              )}
              <button className="btn btn-active">{page + 1}</button>
              {page < pages - 2 && (
                <button className="btn" onClick={(): void => setPage(page + 1)}>
                  {page + 2}
                </button>
              )}
              {page < pages - 3 && <button className="btn-disabled btn">...</button>}
              {page < pages - 1 && (
                <button className="btn" onClick={(): void => setPage(pages - 1)}>
                  {pages}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </DashboardCard>
  );
};
