import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { useContext } from 'hooks/useContext';
import { UNEXPECTED_ERROR } from 'utils/constants';
import type { SuccessCallbackParams } from 'types';

interface UseFetch<T> {
  data?: T;
  setData: Dispatch<SetStateAction<T | undefined>>;
  loading: boolean;
  notFound: boolean;
  fetcher: <T>(params?: {
    url?: string;
    options?: RequestInit;
    successCallback?: ({ data, message }: SuccessCallbackParams<T>) => void;
    errorCallback?: () => void;
  }) => Promise<void>;
}

export const useFetch = <T>({
  url: _url,
  options: _options,
  successCallback: _successCallback,
}: {
  url?: string;
  options?: RequestInit;
  successCallback?: ({ data, message }: SuccessCallbackParams<T>) => void;
} = {}): UseFetch<T> => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { setErrorMessage } = useContext();

  const fetcher = useCallback(
    async <T>({
      url = _url ?? '',
      options = _options,
      successCallback: __successCallback,
      errorCallback,
    }: {
      url?: string;
      options?: RequestInit;
      successCallback?: ({ data, message }: SuccessCallbackParams<T>) => void;
      errorCallback?: () => void;
    } = {}): Promise<void> => {
      setLoading(true);
      setNotFound(false);
      setErrorMessage('');

      const handleError = (msg = UNEXPECTED_ERROR): void => {
        setErrorMessage(msg);
        setNotFound(true);

        if (errorCallback) {
          errorCallback();
        }
      };

      let data;
      let message = '';

      try {
        const res = await fetch(url, options);
        const { status, ok } = res;

        if (status === 404) {
          setLoading(false);
          setNotFound(true);
          return;
        }

        const text = await res.text();

        try {
          ({ data, message } = JSON.parse(text));
        } catch {
          // Received non-JSON response.
        }

        if (ok) {
          if (data) {
            setData(data);
          }

          const successCallback = __successCallback ?? _successCallback;

          if (successCallback) {
            successCallback({ data, message });
          }
        } else {
          handleError(message);
        }
      } catch (e) {
        handleError();
      } finally {
        setLoading(false);
      }
    },
    [_options, _successCallback, _url, setErrorMessage],
  );

  // Fetch automatically only when the hook is provided with a URL.
  useEffect(() => {
    if (_url !== undefined) {
      fetcher({ url: _url, options: _options, successCallback: _successCallback });
    }

    // Ignore: Including all of the dependencies causes an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_url, _options]);

  return {
    data,
    setData,
    loading,
    notFound,
    fetcher,
  };
};
