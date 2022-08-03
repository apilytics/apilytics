import 'styles/globals.css';
import 'styles/github-dark.min.css';
import '@fontsource/ubuntu';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { SessionProvider } from 'next-auth/react';
// Ignore: Fine to import the provider directly from `next-plausible` here.
// eslint-disable-next-line no-restricted-imports
import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';

import { RootContextProvider } from 'context';
import { CommonDataProvider } from 'context/data';
import { FRONTEND_URL } from 'utils/router';

dayjs.extend(localizedFormat);

const FRONTEND_DOMAIN = new URL(FRONTEND_URL).host;

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <PlausibleProvider domain={FRONTEND_DOMAIN} enabled={process.env.VERCEL_ENV === 'production'}>
    <SessionProvider>
      <RootContextProvider>
        <CommonDataProvider>
          <Component {...pageProps} />
        </CommonDataProvider>
      </RootContextProvider>
    </SessionProvider>
  </PlausibleProvider>
);

export default MyApp;
