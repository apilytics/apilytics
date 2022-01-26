import Link from 'next/link';
import React, { useState } from 'react';
import type { FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { usePlausible } from 'hooks/usePlausible';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes, staticRoutes } from 'utils/router';
import type { FormProps, PlausibleEvents } from 'types';

interface Props extends Pick<FormProps, 'subTitle' | 'contentAfter'> {
  title: string;
  description: string;
  formTitle: string;
  plausibleEvent: keyof PlausibleEvents;
  initialError?: string;
  csrfToken: string;
}

export const LoginFormTemplate: React.FC<Props> = ({
  title,
  description,
  formTitle,
  subTitle,
  contentAfter,
  plausibleEvent,
  initialError,
  csrfToken,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const plausible = usePlausible();
  const [error, setError] = useState(initialError || '');
  const headProps = { title, description, indexable: true };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');
    const body = new URLSearchParams({ csrfToken, email, callbackUrl: staticRoutes.root });

    try {
      const res = await fetch(staticApiRoutes.emailSignIn, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (res.status === 200) {
        setError('');
        setSubmitted(true);
        plausible(plausibleEvent);
      } else {
        setError(UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <MainTemplate headProps={headProps}>
        <h4 className="text-white">
          Thanks! We sent you a <span className="text-primary">magic</span> link to your email that
          you can log in with.
        </h4>
        <p>
          Didn't receive an email? Make sure you used the correct email address, request the link
          again and check your spam folder. <Link href={staticRoutes.contact}>Contact us</Link> if
          the problem still persists.
        </p>
        <Button className="btn-primary btn-outline mt-4" onClick={(): void => setSubmitted(false)}>
          Send again
        </Button>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate headProps={headProps}>
      <div className="card rounded-lg p-4 shadow bg-base-100">
        <Form
          title={formTitle}
          subTitle={subTitle}
          contentAfter={contentAfter}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
        >
          <Input
            type="email"
            name="email"
            value={email}
            onChange={({ target }): void => setEmail(target.value)}
            label="Email"
            required
          />
        </Form>
      </div>
    </MainTemplate>
  );
};
