import type { Origin } from '@prisma/client';

import day from 'mocks/metrics/day.json';
import month from 'mocks/metrics/month.json';
import sixMonths from 'mocks/metrics/six-months.json';
import threeMonths from 'mocks/metrics/three-months.json';
import week from 'mocks/metrics/week.json';
import year from 'mocks/metrics/year.json';
import origin from 'mocks/origin.json';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_24_HOURS_VALUE,
  LAST_30_DAYS_VALUE,
} from 'utils/constants';
import type { OriginMetrics } from 'types';

export const MOCK_METRICS: Record<number, OriginMetrics> = {
  [LAST_24_HOURS_VALUE]: day,
  [LAST_7_DAYS_VALUE]: week,
  [LAST_30_DAYS_VALUE]: month,
  [LAST_3_MONTHS_VALUE]: threeMonths,
  [LAST_6_MONTHS_VALUE]: sixMonths,
  [LAST_12_MONTHS_VALUE]: year,
};

export const MOCK_ORIGIN = origin as unknown as Origin;
