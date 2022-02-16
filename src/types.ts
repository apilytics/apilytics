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
  METHODS,
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
  'show-all-endpoints-click': PlausibleProps;
  'copy-api-key': PlausibleProps;
  'footer-link-click': PlausibleProps;
  'add-dynamic-route': PlausibleProps;
  'update-dynamic-route': PlausibleProps;
  'delete-dynamic-route': PlausibleProps;
  'status-code-click': PlausibleProps;
  'show-all-status-codes-click': PlausibleProps;
  'browser-click': PlausibleProps;
  'os-click': PlausibleProps;
  'device-click': PlausibleProps;
  'show-all-browsers-click': PlausibleProps;
  'show-all-operating-systems-click': PlausibleProps;
  'show-all-devices-click': PlausibleProps;
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
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  accountComplete: boolean;
  origins: Origin[];
  setOrigins: Dispatch<SetStateAction<Origin[]>>;
}
export interface OriginContextType {
  slug: string;
  showApiKey: string;
  origin: Origin | null;
  setOrigin: Dispatch<SetStateAction<Origin | null>>;
  metrics: OriginMetrics | null;
  setMetrics: Dispatch<SetStateAction<OriginMetrics | null>>;
  timeFrame: TimeFrame;
  setTimeFrame: Dispatch<SetStateAction<TimeFrame>>;
  selectedMethod: string | undefined;
  setSelectedMethod: Dispatch<SetStateAction<string | undefined>>;
  selectedEndpoint: string | undefined;
  setSelectedEndpoint: Dispatch<SetStateAction<string | undefined>>;
  selectedStatusCode: string | undefined;
  setSelectedStatusCode: Dispatch<SetStateAction<string | undefined>>;
  selectedBrowser: string | undefined;
  setSelectedBrowser: Dispatch<SetStateAction<string | undefined>>;
  selectedOs: string | undefined;
  setSelectedOs: Dispatch<SetStateAction<string | undefined>>;
  selectedDevice: string | undefined;
  setSelectedDevice: Dispatch<SetStateAction<string | undefined>>;
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

export interface GeneralData {
  totalRequests: number;
  totalRequestsGrowth: number;
  totalErrors: number;
  totalErrorsGrowth: number;
  errorRate: number;
  errorRateGrowth: number;
}

export interface TimeFrameData {
  requests: number;
  errors: number;
  time: string;
}

export interface StatusCodeData {
  statusCode: number;
  requests: number;
}

export interface BrowserData {
  browser: string;
  requests: number;
}

export interface OSData {
  os: string;
  requests: number;
}

export interface DeviceData {
  device: string;
  requests: number;
}

export interface UserAgentData {
  browserData: BrowserData[];
  osData: OSData[];
  deviceData: DeviceData[];
}

export interface PercentileData {
  key: string;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
}

export interface EndpointData {
  totalRequests: number;
  endpoint: string;
  method: Metric['method'];
  methodAndEndpoint: string;
  responseTimeAvg: number;
}

export interface ApilyticsPackage {
  identifier: string;
  version: string;
}

export interface OriginMetrics {
  generalData: GeneralData;
  timeFrameData: TimeFrameData[];
  endpointData: EndpointData[];
  percentileData: PercentileData[];
  statusCodeData: StatusCodeData[];
  userAgentData: UserAgentData;
  apilyticsPackage?: ApilyticsPackage;
}

export interface DynamicRouteWithMatches {
  route: string;
  matchingPaths: number;
}

export type Method = typeof METHODS[number];

export type ValueOf<T> = T[keyof T];
