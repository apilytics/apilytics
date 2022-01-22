import 'styles/globals.css';
import '@fontsource/ubuntu';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { SessionProvider } from 'next-auth/react';
import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';

import { AccountProvider } from 'context/account';
import { ModalProvider } from 'context/modal';
import { OriginProvider } from 'context/origin';
import { FRONTEND_URL } from 'utils/router';

dayjs.extend(localizedFormat);

const FRONTEND_DOMAIN = new URL(FRONTEND_URL).host;

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => (
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

export default App;
