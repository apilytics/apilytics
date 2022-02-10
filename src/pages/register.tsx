import { CheckCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';

import { LoginFormTemplate } from 'components/layout/LoginFormTemplate';
import { withNoAuth } from 'hocs/withNoAuth';
import { staticRoutes } from 'utils/router';
import type { LoginPageProps } from 'types';

const SUBTITLE_ITEMS = ['No credit card required', 'Cancel any time', '100% free during beta'];

const Register: NextPage<LoginPageProps> = ({ csrfToken }) => {
  const renderSubTitle = (
    <ul className="mt-4 list-none">
      {SUBTITLE_ITEMS.map((text) => (
        <li className="mt-1 flex" key={text}>
          <CheckCircleIcon className="mr-2 h-5 w-5 text-success" /> {text}
        </li>
      ))}
    </ul>
  );

  const renderSteps = (
    <div>
      <p className="mt-4 text-sm">
        Already have an account? <Link href={staticRoutes.login}>Log in</Link> instead.
      </p>
      <ul className="steps steps-horizontal mt-8">
        <li className="step step-primary">
          <p>Sign up & finish up your account</p>
        </li>
        <li className="step">
          <p>Register your APIs</p>
        </li>
        <li className="step">
          <p>Install middleware</p>
        </li>
      </ul>
    </div>
  );

  return (
    <LoginFormTemplate
      title="Register"
      description="Start your free 30-day trial by registering a new account. No credit card required. Cancel any time."
      formTitle="Start your free 30-day trial"
      subTitle={renderSubTitle}
      contentAfter={renderSteps}
      csrfToken={csrfToken}
      plausibleEvent="register"
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
};

export default withNoAuth(Register);
