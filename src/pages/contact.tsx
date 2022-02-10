import React, { useState } from 'react';
import type { NextPage } from 'next';
import type { ChangeEvent, FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { CTASection } from 'components/shared/CTASection';
import { EmailLink } from 'components/shared/EmailLink';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { TextArea } from 'components/shared/TextArea';
import { withUser } from 'hocs/withUser';
import { usePlausible } from 'hooks/usePlausible';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';

const initialFormValues = {
  email: '',
  message: '',
};

const Contact: NextPage = () => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [error, setError] = useState('');
  const plausible = usePlausible();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmittedText('');
    setError('');

    try {
      const res = await fetch(staticApiRoutes.contact, {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 200) {
        setFormValues(initialFormValues);
        setError('');
        setSubmittedText(message);
        plausible('contact-message');
      } else {
        setError(UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

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
          error={error}
          loading={loading}
          submittedText={submittedText}
        >
          <Input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            label="Your email"
            required
          />
          <TextArea
            name="message"
            label="Your message"
            value={formValues.message}
            onChange={handleChange}
            required
          />
        </Form>
      </div>
      <CTASection />
    </MainTemplate>
  );
};

export default withUser(Contact);
