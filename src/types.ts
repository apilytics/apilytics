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
  MODAL_NAMES,
  MONTH_DAYS,
  ORIGIN_ROLES,
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
  'add-excluded-route': PlausibleProps;
  'update-excluded-route': PlausibleProps;
  'delete-excluded-route': PlausibleProps;
  'status-code-click': PlausibleProps;
  'show-all-status-codes-click': PlausibleProps;
  'browser-click': PlausibleProps;
  'os-click': PlausibleProps;
  'device-click': PlausibleProps;
  'country-click': PlausibleProps;
  'region-click': PlausibleProps;
  'city-click': PlausibleProps;
  'show-all-browsers-click': PlausibleProps;
  'show-all-operating-systems-click': PlausibleProps;
  'show-all-devices-click': PlausibleProps;
  'show-all-countries-click': PlausibleProps;
  'show-all-regions-click': PlausibleProps;
  'show-all-cities-click': PlausibleProps;
  'origin-invite-created': PlausibleProps;
  'origin-invite-resent': PlausibleProps;
  'origin-invite-cancelled': PlausibleProps;
  'origin-invite-accepted': PlausibleProps;
  'origin-invite-declined': PlausibleProps;
  'origin-user-edited': PlausibleProps;
  'origin-user-deleted': PlausibleProps;
  'weekly-email-reports-toggled': PlausibleProps;
  'weekly-email-report-recipient-added': PlausibleProps;
  'weekly-email-report-recipient-deleted': PlausibleProps;
  'weekly-email-reports-sent': PlausibleProps;
};

export interface HeadProps {
  indexable?: boolean;
  title: string;
  description?: string;
  loading?: boolean;
  error?: boolean;
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
  startIcon?: React.FC<ComponentProps<'svg'>>;
  endIcon?: React.FC<ComponentProps<'svg'>>;
  linkTo?: string | UrlObject;
}

export interface MainTemplateProps extends LayoutProps {
  maxWidth?: string;
  dense?: boolean;
}

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  subTitle?: JSX.Element | string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  contentAfter?: React.ReactNode;
  loading: boolean;
  submitButtonText?: string;
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
  accountComplete: boolean;
  origins: OriginListItem[];
  setOrigins: Dispatch<SetStateAction<OriginListItem[]>>;
  originInvites: OriginInviteData[];
  setOriginInvites: Dispatch<SetStateAction<OriginInviteData[]>>;
}
export interface OriginContextType {
  slug: string;
  showApiKey: string;
  origin: OriginData | null;
  setOrigin: Dispatch<SetStateAction<OriginData | null>>;
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
  selectedCountry: string | undefined;
  setSelectedCountry: Dispatch<SetStateAction<string | undefined>>;
  selectedCountryCode: string | undefined;
  setSelectedCountryCode: Dispatch<SetStateAction<string | undefined>>;
  selectedRegion: string | undefined;
  setSelectedRegion: Dispatch<SetStateAction<string | undefined>>;
  selectedCity: string | undefined;
  setSelectedCity: Dispatch<SetStateAction<string | undefined>>;
}

export interface UIContextType {
  successMessage: string;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  modal: MODAL_NAMES | null;
  handleOpenModal: (name: MODAL_NAMES) => void;
  handleCloseModal: () => void;
}

export type RootContextType = AccountContextType & OriginContextType & UIContextType;

export type ApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
) => Promise<void>;

export interface MessageResponse {
  message: string;
}

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

export interface CountryData {
  country: string;
  countryCode: string | null;
  requests: number;
}

export interface RegionData {
  region: string;
  countryCode: string | null;
  requests: number;
}

export interface CityData {
  city: string;
  countryCode: string | null;
  requests: number;
}

export interface GeoLocationData {
  countryData: CountryData[];
  regionData: RegionData[];
  cityData: CityData[];
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
  geoLocationData: GeoLocationData;
  apilyticsPackage?: ApilyticsPackage;
}

export interface RouteData {
  route: string;
  matchingPaths: number;
}

export interface OriginData extends Origin {
  userRole: ORIGIN_ROLES;
  userCount: number;
  dynamicRouteCount: number;
  excludedRouteCount: number;
}

export interface OriginListItem {
  name: string;
  slug: string;
  totalMetrics: number;
  lastDayMetrics: number;
  userRole: ORIGIN_ROLES;
  userCount: number;
  dynamicRouteCount: number;
  excludedRouteCount: number;
}

export interface OriginInviteData {
  id: string;
  role: ORIGIN_ROLES;
  email?: string;
  originSlug?: string;
  originName?: string;
}

export type Method = typeof METHODS[number];

export type ValueOf<T> = T[keyof T];

export type VerticalBarData = Partial<
  EndpointData & StatusCodeData & PercentileData & BrowserData & OSData & DeviceData
>;

export interface OriginUserData {
  id: string;
  email: string;
  role: ORIGIN_ROLES;
}

export type SuccessCallbackParams<T = null> = { data: T; message: string };
