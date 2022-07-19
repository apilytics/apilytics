import dayjs from 'dayjs';
import React from 'react';

import { getFlagEmoji } from 'utils/helpers';
import { formatBytes, formatCount, formatCpuUsage, formatMilliseconds } from 'utils/metrics';
import { FRONTEND_URL } from 'utils/router';
import type { OriginData, OriginMetrics } from 'types';

const HTTP_METHOD_COLORS = {
  POST: '#49cc90',
  GET: '#61affe',
  PUT: '#fca130',
  DELETE: '#f93e3e',
  HEAD: '#c07cfc',
  PATCH: '#50e3c2',
  OPTIONS: '#42bbd7',
  TRACE: '#42bbd7',
  CONNECT: '#42bbd7',
};

const SUCCESS_COLOR = '#009485';
const ERROR_COLOR = '#ff5724';
const PRIMARY_COLOR = '#529dff';
const BASE_CONTENT_COLOR = '#8a8a8a';
const BACKGROUND_COLOR = '#1f2937';

interface Props {
  origin: OriginData;
  metrics: OriginMetrics;
  from: string;
  to: string;
  isPreview?: boolean;
}

export const WeeklyReport: React.FC<Props> = ({
  origin: { name },
  metrics: {
    generalData: {
      totalRequests,
      totalRequestsGrowth,
      totalErrors,
      totalErrorsGrowth,
      errorRate,
      errorRateGrowth,
    },
    endpointData,
    percentileData,
    statusCodeData: _statusCodeData,
    userAgentData: { browserData: _browserData, osData: _osData, deviceData: _deviceData },
    geoLocationData: { countryData: _countryData, regionData: _regionData, cityData: _cityData },
  },
  from,
  to,
  isPreview,
}) => {
  const requestsData = [...endpointData.sort((a, b) => b.totalRequests - a.totalRequests)].slice(
    0,
    10,
  );

  const responseTimeData = [
    ...endpointData.sort((a, b) => b.responseTimeAvg - a.responseTimeAvg),
  ].slice(0, 10);

  const statusCodeData = [..._statusCodeData.sort((a, b) => b.requests - a.requests)].slice(0, 10);
  const countryData = [..._countryData.sort((a, b) => b.requests - a.requests)].slice(0, 10);
  const regionData = [..._regionData.sort((a, b) => b.requests - a.requests)].slice(0, 10);
  const cityData = [..._cityData.sort((a, b) => b.requests - a.requests)].slice(0, 10);

  const avgPercentileData = percentileData.find(({ key }) => key === 'avg');
  const p50PercentileData = percentileData.find(({ key }) => key === 'p50');
  const p75PercentileData = percentileData.find(({ key }) => key === 'p75');
  const p90PercentileData = percentileData.find(({ key }) => key === 'p90');
  const p95PercentileData = percentileData.find(({ key }) => key === 'p95');
  const p99PercentileData = percentileData.find(({ key }) => key === 'p99');

  const browserData = [..._browserData.sort((a, b) => b.requests - a.requests)].slice(0, 10);
  const osData = [..._osData.sort((a, b) => b.requests - a.requests)].slice(0, 10);
  const deviceData = [..._deviceData.sort((a, b) => b.requests - a.requests)].slice(0, 10);

  const positiveTotalRequestsGrowth = totalRequestsGrowth >= 0;
  const positiveTotalErrorsGrowth = totalErrorsGrowth <= 0;
  const positiveErrorRateGrowth = errorRateGrowth <= 0;

  const renderNoMetrics = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: '10rem',
      }}
    >
      No metrics available.
    </div>
  );

  return (
    <>
      <style type="text/css">{`
        * {
          font-size: 14px;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          white-space: nowrap;
        }

        .responsive-grid {
          grid-template-columns: 1fr;
        }

        .responsive-grid div {
          overflow: hidden;
        }

        .responsive-grid li {
          display: flex;
          justify-content: space-between;
          gap: 5px;
        }

        ul {
          margin: 0;
          padding: 0;
        }

        span {
          color: white;
          white-space: nowrap;
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (min-width: 850px) {
          .responsive-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
      <div
        style={{
          padding: '1rem',
          backgroundColor: BACKGROUND_COLOR,
          color: BASE_CONTENT_COLOR,
          width: 'auto',
          maxWidth: '850px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          {/* Ignore: The image will be displayed on an email client where `next/image` is useless/won't work. */}
          <img // eslint-disable-line @next/next/no-img-element
            src={`https://www.apilytics.io/logo.svg`}
            width={120}
            height={80}
            alt="Apilytics logo"
          />
          <div>
            <h6
              style={{
                color: 'white',
                fontSize: 25,
                margin: 0,
                textAlign: 'right',
                wordBreak: 'break-word',
              }}
            >
              Weekly report for {name}
            </h6>
            <p style={{ textAlign: 'right', margin: 0, marginTop: '0.5rem' }}>
              {dayjs(from).format('DD/MM/YYYY')} - {dayjs(to).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
          <li>
            Total requests: <span>{formatCount(totalRequests)}</span>{' '}
            {isFinite(totalRequestsGrowth) && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  color: positiveTotalRequestsGrowth ? SUCCESS_COLOR : ERROR_COLOR,
                }}
              >
                {totalRequestsGrowth < 0 ? '-' : '+'}
                {(totalRequestsGrowth * 100).toFixed()}%
              </span>
            )}
          </li>
          <li>
            Total errors: <span>{formatCount(totalErrors)}</span>
            {isFinite(totalErrorsGrowth) && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  color: positiveTotalErrorsGrowth ? SUCCESS_COLOR : ERROR_COLOR,
                }}
              >
                {totalErrorsGrowth < 0 ? '-' : '+'}
                {(totalErrorsGrowth * 100).toFixed()}%
              </span>
            )}
          </li>
          <li>
            Error rate: <span style={{ color: 'white' }}>{formatCount(errorRate, 2)}</span>
            {isFinite(errorRateGrowth) && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  color: positiveErrorRateGrowth ? SUCCESS_COLOR : ERROR_COLOR,
                }}
              >
                {errorRateGrowth < 0 ? '-' : '+'}
                {(errorRateGrowth * 100).toFixed()}%
              </span>
            )}
          </li>
        </ul>

        <div
          style={{
            display: 'grid',
            gap: '2rem',
            marginTop: '1rem',
          }}
          className="responsive-grid"
        >
          <div>
            <div className="list-header">
              <p>Endpoint</p>
              <p>Requests</p>
            </div>
            <ul>
              {requestsData.length
                ? requestsData.map(({ method, endpoint, totalRequests }) => (
                    <li key={endpoint}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            color: HTTP_METHOD_COLORS[method as keyof typeof HTTP_METHOD_COLORS],
                          }}
                        >
                          {method}
                        </span>
                        <span className="truncate">{endpoint}</span>
                      </div>
                      <span>{formatCount(totalRequests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Endpoint</p>
              <p>Response times</p>
            </div>
            <ul>
              {responseTimeData.length
                ? responseTimeData.map(({ method, endpoint, responseTimeAvg }) => (
                    <li key={endpoint}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            color: HTTP_METHOD_COLORS[method as keyof typeof HTTP_METHOD_COLORS],
                          }}
                        >
                          {method}
                        </span>
                        <span className="truncate">{endpoint}</span>
                      </div>
                      <span>{formatMilliseconds(responseTimeAvg)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Status codes</p>
              <p>Requests</p>
            </div>
            <ul>
              {statusCodeData.length
                ? statusCodeData.map(({ statusCode, requests }) => (
                    <li key={statusCode}>
                      <span>{statusCode}</span>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Country</p>
              <p>Requests</p>
            </div>
            <ul>
              {countryData.length
                ? countryData.map(({ country, countryCode, requests }) => (
                    <li key={countryCode}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {countryCode && <span>{getFlagEmoji(countryCode)}</span>}
                        <span className="truncate">{country}</span>
                      </div>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Region</p>
              <p>Requests</p>
            </div>
            <ul>
              {regionData.length
                ? regionData.map(({ region, countryCode, requests }) => (
                    <li key={countryCode}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {countryCode && <span>{getFlagEmoji(countryCode)}</span>}
                        <span className="truncate">{region}</span>
                      </div>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>City</p>
              <p>Requests</p>
            </div>
            <ul>
              {cityData.length
                ? cityData.map(({ city, countryCode, requests }) => (
                    <li key={countryCode}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {countryCode && <span>{getFlagEmoji(countryCode)}</span>}
                        <span className="truncate">{city}</span>
                      </div>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Value</p>
              <p>Response times</p>
            </div>
            <ul>
              <li>
                <span>avg</span>
                <span>{formatMilliseconds(avgPercentileData?.responseTime)}</span>
              </li>
              <li>
                <span>p50</span>
                <span>{formatMilliseconds(p50PercentileData?.responseTime)}</span>
              </li>
              <li>
                <span>p75</span>
                <span>{formatMilliseconds(p75PercentileData?.responseTime)}</span>
              </li>
              <li>
                <span>p90</span>
                <span>{formatMilliseconds(p90PercentileData?.responseTime)}</span>
              </li>
              <li>
                <span>p95</span>
                <span>{formatMilliseconds(p95PercentileData?.responseTime)}</span>
              </li>
              <li>
                <span>p99</span>
                <span>{formatMilliseconds(p99PercentileData?.responseTime)}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Value</p>
              <p>Request sizes</p>
            </div>
            <ul>
              <li>
                <span>avg</span>
                <span>{formatBytes(avgPercentileData?.requestSize)}</span>
              </li>
              <li>
                <span>p50</span>
                <span>{formatBytes(p50PercentileData?.requestSize)}</span>
              </li>
              <li>
                <span>p75</span>
                <span>{formatBytes(p75PercentileData?.requestSize)}</span>
              </li>
              <li>
                <span>p90</span>
                <span>{formatBytes(p90PercentileData?.requestSize)}</span>
              </li>
              <li>
                <span>p95</span>
                <span>{formatBytes(p95PercentileData?.requestSize)}</span>
              </li>
              <li>
                <span>p99</span>
                <span>{formatBytes(p99PercentileData?.requestSize)}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Value</p>
              <p>Response sizes</p>
            </div>
            <ul>
              <li>
                <span>avg</span>
                <span>{formatBytes(avgPercentileData?.responseSize)}</span>
              </li>
              <li>
                <span>p50</span>
                <span>{formatBytes(p50PercentileData?.responseSize)}</span>
              </li>
              <li>
                <span>p75</span>
                <span>{formatBytes(p75PercentileData?.responseSize)}</span>
              </li>
              <li>
                <span>p90</span>
                <span>{formatBytes(p90PercentileData?.responseSize)}</span>
              </li>
              <li>
                <span>p95</span>
                <span>{formatBytes(p95PercentileData?.responseSize)}</span>
              </li>
              <li>
                <span>p99</span>
                <span>{formatBytes(p99PercentileData?.responseSize)}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Value</p>
              <p>CPU usage</p>
            </div>
            <ul>
              <li>
                <span>avg</span>
                <span>{formatCpuUsage(avgPercentileData?.cpuUsage)}</span>
              </li>
              <li>
                <span>p50</span>
                <span>{formatCpuUsage(p50PercentileData?.cpuUsage)}</span>
              </li>
              <li>
                <span>p75</span>
                <span>{formatCpuUsage(p75PercentileData?.cpuUsage)}</span>
              </li>
              <li>
                <span>p90</span>
                <span>{formatCpuUsage(p90PercentileData?.cpuUsage)}</span>
              </li>
              <li>
                <span>p95</span>
                <span>{formatCpuUsage(p95PercentileData?.cpuUsage)}</span>
              </li>
              <li>
                <span>p99</span>
                <span>{formatCpuUsage(p99PercentileData?.cpuUsage)}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Value</p>
              <p>Memory usage</p>
            </div>
            <ul>
              <li>
                <span>avg</span>
                <span>{formatBytes(avgPercentileData?.memoryUsage)}</span>
              </li>
              <li>
                <span>p50</span>
                <span>{formatBytes(p50PercentileData?.memoryUsage)}</span>
              </li>
              <li>
                <span>p75</span>
                <span>{formatBytes(p75PercentileData?.memoryUsage)}</span>
              </li>
              <li>
                <span>p90</span>
                <span>{formatBytes(p90PercentileData?.memoryUsage)}</span>
              </li>
              <li>
                <span>p95</span>
                <span>{formatBytes(p95PercentileData?.memoryUsage)}</span>
              </li>
              <li>
                <span>p99</span>
                <span>{formatBytes(p99PercentileData?.memoryUsage)}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Value</p>
              <p>Total memory</p>
            </div>
            <ul>
              <li>
                <span>avg</span>
                <span>{formatBytes(avgPercentileData?.memoryTotal)}</span>
              </li>
              <li>
                <span>p50</span>
                <span>{formatBytes(p50PercentileData?.memoryTotal)}</span>
              </li>
              <li>
                <span>p75</span>
                <span>{formatBytes(p75PercentileData?.memoryTotal)}</span>
              </li>
              <li>
                <span>p90</span>
                <span>{formatBytes(p90PercentileData?.memoryTotal)}</span>
              </li>
              <li>
                <span>p95</span>
                <span>{formatBytes(p95PercentileData?.memoryTotal)}</span>
              </li>
              <li>
                <span>p99</span>
                <span>{formatBytes(p99PercentileData?.memoryTotal)}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Browser</p>
              <p>Requests</p>
            </div>
            <ul>
              {browserData.length
                ? browserData.map(({ browser, requests }) => (
                    <li key={browser}>
                      <span className="truncate">{browser}</span>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>OS</p>
              <p>Requests</p>
            </div>
            <ul>
              {osData.length
                ? osData.map(({ os, requests }) => (
                    <li key={os}>
                      <span className="truncate">{os}</span>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>

          <div>
            <div className="list-header">
              <p>Device</p>
              <p>Requests</p>
            </div>
            <ul>
              {deviceData.length
                ? deviceData.map(({ device, requests }) => (
                    <li key={device}>
                      <span className="truncate">{device}</span>
                      <span>{formatCount(requests)}</span>
                    </li>
                  ))
                : renderNoMetrics}
            </ul>
          </div>
        </div>

        {!isPreview && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <a
              href={`${FRONTEND_URL}/origins/${name}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: PRIMARY_COLOR }}
            >
              Log in to your dashboard
            </a>
            <p style={{ margin: 0 }}>
              <a href={`${FRONTEND_URL}/account`} style={{ color: PRIMARY_COLOR }}>
                Unsubscribe
              </a>{' '}
              from emails
            </p>
          </div>
        )}
      </div>
    </>
  );
};
