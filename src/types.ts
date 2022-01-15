import type { UrlObject } from 'url';

import type { Origin, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ComponentProps, Dispatch, SetStateAction } from 'react';

import type {
  DAY,
  MONTH_DAYS,
  SIX_MONTHS_DAYS,
  THREE_MONTHS_DAYS,
  WEEK_DAYS,
  YEAR_DAYS,
} from 'utils/constants';
import type { staticRoutes } from 'utils/router';

export type TimeFrame =
  | typeof DAY
  | typeof WEEK_DAYS
  | typeof MONTH_DAYS
  | typeof THREE_MONTHS_DAYS
  | typeof SIX_MONTHS_DAYS
  | typeof YEAR_DAYS;

export type PlausibleEvents = {
  login: never;
  logout: never;
  'update-account': never;
  'new-origin': never;
  'update-origin': never;
  'delete-origin': never;
  'email-list-subscribe': never;
  'contact-message': never;
};

export interface HeadProps {
  noIndex?: boolean;
  customTags?: JSX.Element;
}

export interface HeaderProps {
  maxWidth?: string;
}

export type LayoutProps = HeadProps & HeaderProps;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean | 'mobile';
  loading?: boolean;
  tooltip?: string;
  endIcon?: React.FC<ComponentProps<'svg'>>;
  linkTo?: string | UrlObject;
  tooltipProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface DocsFrontMatter {
  name: string;
  routeName: keyof typeof staticRoutes;
  order: number;
  subOrder: number;
}

interface BlogsFrontMatter {
  title: string;
  slug: string;
  readingTime: string;
  author: string;
  authorImage: string;
  excerpt: string;
  date: string;
}

export interface MDXPageProps extends Record<string, unknown> {
  source: MDXRemoteSerializeResult;
}

export interface DocsPageProps extends MDXPageProps {
  docsData: DocsFrontMatter[];
  data: DocsFrontMatter;
}

export interface BlogPageProps extends MDXPageProps {
  blogsData: BlogsFrontMatter[];
  data: BlogsFrontMatter;
}

export interface Snippet {
  name: string;
  order: number;
  source: MDXRemoteSerializeResult;
}

export interface AccountContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
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

export type ApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
) => Promise<void>;

export interface AggregatedOrigin extends Origin {
  last24hRequests: number;
}

export interface TimeFrameData {
  requests: number;
  time: string;
}

export interface RouteData {
  requests: number;
  name: string;
  methods: string[];
  status_codes: number[];
  response_time: number;
  count_green: number;
  count_yellow: number;
  count_red: number;
}

export interface OriginMetrics {
  totalRequests: number;
  totalRequestsGrowth: number;
  timeFrameData: TimeFrameData[];
  routeData: RouteData[];
}
