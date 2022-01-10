import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';

import { ExternalLink } from 'components/shared/ExternalLink';
import { Input } from 'components/shared/Input';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes, staticRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

export const Footer: React.FC = () => {
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
    <footer className="footer footer-center bg-base-100">
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
          <div className="flex flex-col text-left">
            <ul>
              <p>
                <Link href={staticRoutes.docs}>Docs</Link>
              </p>
              <p>
                <Link href={staticRoutes.contact}>Contact</Link>
              </p>
              <p>
                <ExternalLink href="https://twitter.com/apilytics">Twitter</ExternalLink>
              </p>
              <p>
                <ExternalLink href="https://github.com/apilytics">Github</ExternalLink>
              </p>
              <p>
                <Link href={staticRoutes.privacy}>Privacy</Link>
              </p>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="text-left">
            <Input
              name="email"
              label="Keep me updated"
              type="email"
              value={email}
              onChange={({ target }): void => setEmail(target.value)}
              placeholder="Your email"
              endIcon={ArrowSmRightIcon}
              helperText="No spam. Unsubscribe at any time."
              loading={loading}
            />
            {error && <p className="mt-4 label-text text-error">{error}</p>}
            {submittedText && <p className="mt-4 label-text">{submittedText}</p>}
          </form>
        </div>
        <h5 className="footer-title mt-8">© {new Date().getFullYear()} Apilytics</h5>
      </div>
    </footer>
  );
};
