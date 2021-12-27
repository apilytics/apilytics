import 'styles/index.css';
import '@fontsource/ubuntu';

import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';

import { FRONTEND_DOMAIN } from 'utils/constants';

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <PlausibleProvider domain={FRONTEND_DOMAIN} enabled={process.env.VERCEL_ENV === 'production'}>
    <Component {...pageProps} />
  </PlausibleProvider>
);

export default App;
