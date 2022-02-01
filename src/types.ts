import type { UrlObject } from 'url';

import type { Metric, Origin, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type {
  ComponentProps,
  Dispatch,
  FormEvent,
  FormHTMLAttributes,
  SetStateAction,
} from 'react';

import type {
  DAY,
  MONTH_DAYS,
  SIX_MONTHS_DAYS,
  THREE_MONTHS_DAYS,
  WEEK_DAYS,
  YEAR_DAYS,
} from 'utils/constants';

export type TimeFrame =
  | typeof DAY
  | typeof WEEK_DAYS
  | typeof MONTH_DAYS
  | typeof THREE_MONTHS_DAYS
  | typeof SIX_MONTHS_DAYS
  | typeof YEAR_DAYS;

type PlausibleProps = Record<string, unknown>;

export type PlausibleEvents = {
  login: PlausibleProps;
  register: PlausibleProps;
  logout: PlausibleProps;
  'update-account': PlausibleProps;
  'new-origin': PlausibleProps;
  'update-origin': PlausibleProps;
  'delete-origin': PlausibleProps;
  'contact-message': PlausibleProps;
  'logo-click': PlausibleProps;
  'pricing-click': PlausibleProps;
  'login-click': PlausibleProps;
  'register-click': PlausibleProps;
  'live-demo-click': PlausibleProps;
  'setup-snippet-click': PlausibleProps;
  'setup-framework-select': PlausibleProps;
  'pricing-slider-click': PlausibleProps;
  'email-list-subscribe': PlausibleProps;
  'time-frame-selector-click': PlausibleProps;
  'endpoint-click': PlausibleProps;
  'show-all-requests-click': PlausibleProps;
  'show-all-response-times-click': PlausibleProps;
  'copy-api-key': PlausibleProps;
  'footer-link-click': PlausibleProps;
  'add-dynamic-route': PlausibleProps;
  'update-dynamic-route': PlausibleProps;
  'delete-dynamic-route': PlausibleProps;
};

export interface HeadProps {
  indexable?: boolean;
  title: string;
  description?: string;
  loading?: boolean;
}

export interface HeaderProps {
  maxWidth?: string;
}

export interface FooterProps {
  maxWidth?: string;
}

export type LayoutProps = {
  headProps: HeadProps;
  headerProps?: HeaderProps;
  footerProps?: FooterProps;
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean | 'mobile';
  loading?: boolean;
  tooltip?: string;
  startIcon?: React.FC<ComponentProps<'svg'>>;
  endIcon?: React.FC<ComponentProps<'svg'>>;
  linkTo?: string | UrlObject;
  tooltipProps?: React.HTMLAttributes<HTMLDivElement>;
}

export interface MainTemplateProps extends LayoutProps {
  maxWidth?: string;
  dense?: boolean;
}

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  subTitle?: JSX.Element | string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error: string;
  loading?: boolean;
  submittedText?: string;
  contentAfter?: React.ReactNode;
}

export interface DocsFrontMatter {
  name: string;
  description: string;
  path: string;
  order: number;
  subOrder?: number;
  updatedAt: string;
}

export interface BlogsFrontMatter {
  title: string;
  description: string;
  slug: string;
  author: string;
  authorLink: string;
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

export interface LoginPageProps extends Record<string, unknown> {
  csrfToken: string;
}

export interface Snippet {
  name: string;
  order: number;
  source: MDXRemoteSerializeResult;
}

export interface AccountContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  accountComplete: boolean;
  origins: Origin[];
  setOrigins: Dispatch<SetStateAction<Origin[]>>;
}
export interface OriginContextType {
  origin: Origin | null;
  setOrigin: Dispatch<SetStateAction<Origin | null>>;
  metrics: OriginMetrics | null;
  setMetrics: Dispatch<SetStateAction<OriginMetrics | null>>;
}

export interface ModalContextType {
  modal: string | null;
  handleOpenModal: (name: string) => void;
  handleCloseModal: () => void;
}

export type ApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
) => Promise<void>;

export interface TimeFrameData {
  requests: number;
  errors: number;
  time: string;
}
interface MetricStats {
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface NullableMetricStats {
  avg: number | null;
  p50: number | null;
  p75: number | null;
  p90: number | null;
  p95: number | null;
  p99: number | null;
}

export interface EndpointData {
  totalRequests: number;
  endpoint: string;
  method: Metric['method'];
  statusCodes: Metric['statusCode'][];
  responseTimes: MetricStats;
  requestSizes: NullableMetricStats;
  responseSizes: NullableMetricStats;
}

export interface OriginMetrics {
  totalRequests: number;
  totalRequestsGrowth: number;
  totalErrors: number;
  totalErrorsGrowth: number;
  timeFrameData: TimeFrameData[];
  endpointData: EndpointData[];
}

export interface DynamicRouteWithMatches {
  route: string;
  matchingPaths: number;
}
