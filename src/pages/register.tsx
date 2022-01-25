import Link from 'next/link';
import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';

import { LoginFormTemplate } from 'components/layout/LoginFormTemplate';
import { withNoAuth } from 'hocs/withNoAuth';
import { staticRoutes } from 'utils/router';
import type { LoginPageProps } from 'types';

const Register: NextPage<LoginPageProps> = ({ csrfToken }) => {
  const renderSubTitle = (
    <ul className="mt-4">
      <li>No credit card required.</li>
      <li>Cancel any time.</li>
      <li>100% free during beta.</li>
    </ul>
  );

  const renderSteps = (
    <>
      <p className="text-sm mt-4">
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
    </>
  );

  return (
    <LoginFormTemplate
      title="Register"
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
