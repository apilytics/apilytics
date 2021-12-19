import type {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
  Method,
} from 'utils';

export interface RouteData {
  name: string;
  requests: number;
  methods: Method[];
  responseTime: number;
  responseGreen: number;
  responseYellow: number;
  responseRed: number;
}

export interface RequestData {
  date: string;
  requests: number;
}

export interface RequestSource {
  name: string;
  totalRequests: number;
  totalRequestsGrowth: number;
  requestsPerSession: number;
  requestsPerSessionGrowth: number;
  requestsData: RequestData[];
  routesData: RouteData[];
}

export type TimeFrame =
  | typeof LAST_7_DAYS_VALUE
  | typeof LAST_30_DAYS_VALUE
  | typeof LAST_3_MONTHS_VALUE
  | typeof LAST_6_MONTHS_VALUE
  | typeof LAST_12_MONTHS_VALUE;
