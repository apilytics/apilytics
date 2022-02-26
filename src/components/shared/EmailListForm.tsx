import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import { usePlausible } from 'hooks/usePlausible';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';

export const EmailListForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const plausible = usePlausible();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch(staticApiRoutes.emailList, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 201) {
        setErrorMessage('');
        setEmail('');
        setSuccessMessage(message);
        plausible('email-list-subscribe');
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
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
            onChange={({ target }): void => setEmail(target.value)}
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
