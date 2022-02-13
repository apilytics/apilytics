import 'styles/globals.css';
import 'styles/github-dark.min.css';
import '@fontsource/ubuntu';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import App from 'next/app';
import { getSession, SessionProvider } from 'next-auth/react';
// Ignore: Fine to import directly from `next-plausible`.
// eslint-disable-next-line no-restricted-imports
import PlausibleProvider from 'next-plausible';
import type { AppContext, AppInitialProps, AppProps } from 'next/app';

import { AccountProvider } from 'context/account';
import { ModalProvider } from 'context/modal';
import { OriginProvider } from 'context/origin';
import { FRONTEND_URL } from 'utils/router';

dayjs.extend(localizedFormat);

const FRONTEND_DOMAIN = new URL(FRONTEND_URL).host;

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => (
  <PlausibleProvider domain={FRONTEND_DOMAIN} enabled={process.env.VERCEL_ENV === 'production'}>
    <SessionProvider session={session}>
      <AccountProvider>
        <OriginProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </OriginProvider>
      </AccountProvider>
    </SessionProvider>
  </PlausibleProvider>
);

MyApp.getInitialProps = async (ctx: AppContext): Promise<AppInitialProps> => {
  const initialProps = await App.getInitialProps(ctx);

  return {
    ...initialProps,
    pageProps: {
      ...initialProps.pageProps,
      // @ts-ignore: `ctx.req` is an optional parameter in `AppContext` but required by `getSession`.
      session: await getSession(ctx),
    },
  };
};

export default MyApp;
