import { useRouter } from 'next/router';
// Ignore: This is the only place where want to import directly from `next-plausible`.
// eslint-disable-next-line no-restricted-imports
import { usePlausible as _usePlausible } from 'next-plausible';

import type { PlausibleEvents } from 'types';
import type { EVENT_LOCATIONS } from 'utils/constants';

interface PlausibleOptions {
  location?: EVENT_LOCATIONS;
  value?: string;
}

type PlausibleEvent = (event: keyof PlausibleEvents, options?: PlausibleOptions) => void;

export const usePlausible = (): PlausibleEvent => {
  const { asPath: path } = useRouter();
  const _plausible = _usePlausible<PlausibleEvents>();

  const plausible: PlausibleEvent = (event, options): void => {
    const props = { props: { ...options, path } };
    _plausible(event, props as never);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Plausible event: ${event} ${JSON.stringify(props)}`);
    }
  };

  return plausible;
};
