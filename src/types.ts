import type { Metric, Site, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

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
  signup: never;
};

export interface HeadProps {
  noIndex?: boolean;
  customTags?: JSX.Element;
}

export interface HeaderProps {
  headerMaxWidth?: string;
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
}

export interface SignUpBody {
  email: string;
  role: string;
  useCases?: string;
  howThisCouldHelp?: string;
}

export interface SitesListGetResponse {
  data: Site[];
}

export interface SitesPostResponse {
  data: Site;
}

export interface MetricsListGetResponse {
  data: Metric[];
}

export interface MetricsPostResponse {
  data: Metric;
}

export interface SitesDetailGetResponse {
  data: Site;
}

export interface AccountDetailGetResponse {
  data: User;
}

export type SitesPostBody = Pick<Site, 'domain'>;
export type MetricsPostBody = Pick<Metric, 'path' | 'method' | 'timeMillis'>;
export type SitesDetailPutBody = Pick<Site, 'domain'>;
export type SitesDetailPutResponse = SitesDetailGetResponse;
export type AccountDetailPutResponse = AccountDetailGetResponse;
export type AccountDetailPutBody = Pick<User, 'email'>;
