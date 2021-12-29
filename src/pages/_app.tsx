import 'styles/index.css';
import '@fontsource/ubuntu';

import { SessionProvider } from 'next-auth/react';
import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';

import { FRONTEND_DOMAIN } from 'utils/constants';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => (
  <PlausibleProvider domain={FRONTEND_DOMAIN} enabled={process.env.VERCEL_ENV === 'production'}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </PlausibleProvider>
);

export default App;
