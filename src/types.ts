import type { Metric, Origin, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
  Method,
} from 'utils/constants';

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

export interface APIResponse {
  source: string;
  sourceOptions: string[];
  totalRequests: number;
  totalRequestsGrowth: number;
  requestsData: RequestData[];
  routesData: RouteData[];
}

export type TimeFrame =
  | typeof LAST_7_DAYS_VALUE
  | typeof LAST_30_DAYS_VALUE
  | typeof LAST_3_MONTHS_VALUE
  | typeof LAST_6_MONTHS_VALUE
  | typeof LAST_12_MONTHS_VALUE;

export type PlausibleEvents = {
  login: never;
  logout: never;
  'update-account': never;
};

export interface HeadProps {
  noIndex?: boolean;
  customTags?: JSX.Element;
}

export interface HeaderProps {
  headerMaxWidth?: string;
  headerContent?: JSX.Element | false;
  hideLogin?: boolean;
}

// API types.

export type ApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
) => Promise<void>;

// Our custom user that next-auth holds in its sessions.
export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface OriginsListGetResponse {
  data: Origin[];
}

export interface OriginsPostResponse {
  data: Origin;
}

export interface MetricsListGetResponse {
  data: Metric[];
}

export interface OriginsDetailGetResponse {
  data: Origin;
}

export interface AccountDetailGetResponse {
  data: User;
}

export type OriginsPostBody = Pick<Origin, 'domain'>;
export type MiddlewarePostBody = Pick<Metric, 'path' | 'method' | 'timeMillis'>;
export type OriginsDetailPutBody = Pick<Origin, 'domain'>;
export type OriginsDetailPutResponse = OriginsDetailGetResponse;
export type AccountDetailPutResponse = AccountDetailGetResponse;
export type AccountDetailPutBody = Pick<User, 'name' | 'email'>;
