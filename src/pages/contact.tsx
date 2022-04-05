import React from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { CTASection } from 'components/shared/CTASection';
import { EmailLink } from 'components/shared/EmailLink';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { TextArea } from 'components/shared/TextArea';
import { withUser } from 'hocs/withUser';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { staticApiRoutes } from 'utils/router';

const Contact: NextPage = () => {
  const { loading, formValues, onInputChange, submitForm } = useForm({
    email: '',
    message: '',
  });

  const plausible = usePlausible();

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    submitForm({
      url: staticApiRoutes.contact,
      options: {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: (): void => plausible('contact-message'),
    });
  };

  const renderSubTitle = (
    <>
      Any feedback is appreciated. You can also reach out to us by email at <EmailLink />.
    </>
  );

  return (
    <MainTemplate
      headProps={{
        title: 'Contact',
        description:
          "Get in touch by sending us a message or contacting us by email. We'll get back to you as soon as possible.",
        indexable: true,
      }}
    >
      <div className="card rounded-lg bg-base-100 p-4 shadow">
        <Form
          title="Send us a message"
          subTitle={renderSubTitle}
          onSubmit={handleSubmit}
          loading={loading}
        >
          <Input
            type="email"
            name="email"
            value={formValues.email}
            onChange={onInputChange}
            label="Your email"
            required
          />
          <TextArea
            name="message"
            label="Your message"
            value={formValues.message}
            onChange={onInputChange}
            required
          />
        </Form>
      </div>
      <CTASection />
    </MainTemplate>
  );
};

export default withUser(Contact);
