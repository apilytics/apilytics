import 'styles/globals.css';
import '@fontsource/ubuntu';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { SessionProvider } from 'next-auth/react';
import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';

import { AccountProvider } from 'context/account';
import { OriginProvider } from 'context/origin';
import { FRONTEND_DOMAIN } from 'utils/constants';

dayjs.extend(localizedFormat);

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => (
  <PlausibleProvider domain={FRONTEND_DOMAIN} enabled={process.env.VERCEL_ENV === 'production'}>
    <SessionProvider session={session}>
      <AccountProvider>
        <OriginProvider>
          <Component {...pageProps} />
        </OriginProvider>
      </AccountProvider>
    </SessionProvider>
  </PlausibleProvider>
);

export default App;
