import 'styles/index.css';
import '@fontsource/ubuntu';

import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';

import { FRONTEND_DOMAIN } from 'utils';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <PlausibleProvider domain={FRONTEND_DOMAIN}>
      <Component {...pageProps} />;
    </PlausibleProvider>
  );
};

export default App;
