import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { staticApiRoutes } from 'utils/router';

export const EmailListForm: React.FC = () => {
  const {
    loading,
    formValues: { email },
    onInputChange,
    submitForm,
  } = useForm({ email: '' });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const plausible = usePlausible();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    submitForm({
      url: staticApiRoutes.emailList,
      options: {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ message }): void => {
        setErrorMessage('');
        setSuccessMessage(message);
        plausible('email-list-subscribe');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Keep me updated</span>
        </label>
        <div className="flex flex-wrap">
          <input
            name="email"
            type="email"
            id="email-input"
            placeholder="Your email"
            value={email}
            onChange={onInputChange}
            className="input-primary input w-full sm:w-auto"
            required
          />
          <Button
            type="submit"
            className="btn-outline btn-primary mt-2 sm:mt-0 sm:ml-2"
            fullWidth="mobile"
            loading={loading}
          >
            Submit
          </Button>
        </div>
        <label className="label">
          <span className="label-text-alt">No spam. Unsubscribe at any time.</span>
        </label>
        {errorMessage && (
          <label className="label">
            <span className="label-text-alt text-error">{errorMessage}</span>
          </label>
        )}
        {successMessage && (
          <label className="label">
            <span className="label-text-alt text-white">{successMessage}</span>
          </label>
        )}
      </div>
    </form>
  );
};
