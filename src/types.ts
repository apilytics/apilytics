import type { Metric, Origin, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Dispatch, SetStateAction } from 'react';

import type {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_24_HOURS_VALUE,
  LAST_30_DAYS_VALUE,
} from 'utils/constants';

export type TimeFrame =
  | typeof LAST_24_HOURS_VALUE
  | typeof LAST_7_DAYS_VALUE
  | typeof LAST_30_DAYS_VALUE
  | typeof LAST_3_MONTHS_VALUE
  | typeof LAST_6_MONTHS_VALUE
  | typeof LAST_12_MONTHS_VALUE;

export type PlausibleEvents = {
  login: never;
  logout: never;
  'update-account': never;
  'new-origin': never;
  'update-origin': never;
  'delete-origin': never;
};

export interface HeadProps {
  noIndex?: boolean;
  customTags?: JSX.Element;
}

export interface HeaderProps {
  maxWidth?: string;
  hideLogin?: boolean;
}

export type LayoutProps = HeadProps & HeaderProps;

export interface AccountContextType {
  user?: SessionUser;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  accountComplete: boolean;
  origins: AggregatedOrigin[];
  setOrigins: Dispatch<SetStateAction<AggregatedOrigin[]>>;
}
export interface OriginContextType {
  origin: Origin | null;
  setOrigin: Dispatch<SetStateAction<Origin | null>>;
  metrics: OriginMetrics | null;
  setMetrics: Dispatch<SetStateAction<OriginMetrics | null>>;
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

export interface AggregatedOrigin extends Origin {
  last24hRequests: number;
}

export interface OriginsListGetResponse {
  data: AggregatedOrigin[];
}

export interface OriginsPostResponse {
  data: Origin;
}

export interface TimeFrameData {
  requests: number;
  time: string;
}

export interface RouteData {
  requests: number;
  name: string;
  methods: string[];
  response_time: number;
  count_green: number;
  count_yellow: number;
  count_red: number;
}

export interface OriginMetrics {
  totalRequests: number;
  totalRequestsGrowth: string;
  timeFrameData: TimeFrameData[];
  routeData: RouteData[];
}

export interface MetricsListGetResponse {
  data: OriginMetrics;
}

export interface OriginsDetailGetResponse {
  data: Origin;
}

export interface AccountDetailGetResponse {
  data: User;
}

export type MiddlewarePostBody = Pick<Metric, 'path' | 'method' | 'timeMillis'>;
export type OriginsPostBody = Pick<Origin, 'name'>;
export type OriginsDetailPutBody = Pick<Origin, 'name'>;
export type OriginsDetailPutResponse = OriginsDetailGetResponse;
export type AccountDetailPutResponse = AccountDetailGetResponse;
export type AccountDetailPutBody = Pick<User, 'name' | 'email'>;
