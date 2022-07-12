import { useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import type { SuccessCallbackParams } from 'types';

interface UseForm<T> {
  submitting: boolean;
  formValues: T;
  setFormValues: Dispatch<SetStateAction<T>>;
  submitted: boolean;
  setSubmitted: Dispatch<SetStateAction<boolean>>;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  submitForm: <T>(params: {
    url: string;
    options?: RequestInit;
    successCallback?: ({ data, message }: SuccessCallbackParams<T>) => void;
    errorCallback?: () => void;
  }) => void;
}

export const useForm = <T extends Record<string, unknown>>(
  initialFormValues: T = {} as T,
): UseForm<T> => {
  const { setSuccessMessage } = useContext();
  const { loading: submitting, fetcher } = useFetch<T>();
  const [formValues, setFormValues] = useState<T>(initialFormValues);
  const [submitted, setSubmitted] = useState(false);

  const onInputChange = ({
    target: { name, value: _value, type, checked },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    if (!Object.keys(formValues).includes(name) && process.env.NODE_ENV !== 'production') {
      throw Error(`No form field found with name: ${name}`);
    }

    let value: string | boolean = _value;

    if (type === 'checkbox') {
      value = checked;
    }

    setFormValues({ ...formValues, [name]: value } as T);
  };

  const submitForm = <T>({
    url,
    options,
    successCallback: _successCallback,
    errorCallback,
  }: {
    url: string;
    options?: RequestInit;
    successCallback?: ({ data, message }: SuccessCallbackParams<T>) => void;
    errorCallback?: () => void;
  }): void => {
    setSubmitted(false);

    const successCallback = ({ data, message }: SuccessCallbackParams<T>): void => {
      setFormValues(initialFormValues);
      setSubmitted(true);

      if (message) {
        setSuccessMessage(message);
      }

      if (_successCallback) {
        _successCallback({ data, message });
      }
    };

    fetcher<T>({ url, options, successCallback, errorCallback });
  };

  return {
    submitting,
    formValues,
    setFormValues,
    submitted,
    setSubmitted,
    onInputChange,
    submitForm,
  };
};
