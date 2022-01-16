import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

interface Props {
  label: JSX.Element | string;
}

export const EmailListForm: React.FC<Props> = ({ label }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const plausible = usePlausible<PlausibleEvents>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmittedText('');

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
        setError('');
        setEmail('');
        setSubmittedText(message);
        plausible('email-list-subscribe');
      } else {
        setError(message || UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <div className="flex flex-wrap">
          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={({ target }): void => setEmail(target.value)}
            className="input input-primary w-full sm:w-auto"
            required
          />
          <Button
            type="submit"
            className="btn-primary mt-2 sm:mt-0 sm:ml-2"
            fullWidth="mobile"
            loading={loading}
          >
            Submit
          </Button>
        </div>
        <label className="label">
          <span className="label-text-alt">No spam. Unsubscribe at any time.</span>
        </label>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {submittedText && (
          <label className="label">
            <span className="label-text-alt text-white">{submittedText}</span>
          </label>
        )}
      </div>
    </form>
  );
};
