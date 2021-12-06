import type { AppProps } from 'next/app';
import 'index.css';
import '@fontsource/ubuntu';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
