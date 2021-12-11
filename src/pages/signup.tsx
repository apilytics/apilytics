import React, { useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { Input, Layout, Select, Textarea } from 'components';

const initialFormValues = {
  role: '',
  useCases: '',
  howThisCouldHelp: '',
  willingToPay: '',
  email: '',
};

const SignUp: NextPage = () => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [error, setError] = useState('');
  const [_loading, setLoading] = useState(false); // TODO: Add a loading indicator to represent the loading state.
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');
    const unexpectedError = 'Unexpected error.';
    const payload = { ...formValues, willingToPay: Boolean(formValues.willingToPay) };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 201) {
        setFormValues(initialFormValues);
        setError('');
        setSubmitted(true);
      } else {
        setError(message || unexpectedError);
      }
    } catch {
      setError(unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

  return (
    <Layout noIndex>
      <div className="container max-w-lg">
        <h2 className="text-2xl text-secondary mt-16">Sign up for the free beta</h2>
        <form onSubmit={handleSubmit} className="mt-4 text-left">
          <Input
            name="role"
            value={formValues.role}
            onChange={handleChange}
            label="Your role"
            placeholder="e.g. Software Engineer @ Google"
            helperText="Where do you work and what do you do?"
            required
            autoFocus
          />
          <Textarea
            name="useCases"
            value={formValues.useCases}
            onChange={handleChange}
            label="How would you use this?"
            helperText="Please give your free word on how you would use a product like Apilytics. Would you use it professionally or in your side-projects?"
            rows={4}
            required
          />
          <Textarea
            name="howThisCouldHelp"
            value={formValues.howThisCouldHelp}
            onChange={handleChange}
            label="How could this help you?"
            helperText="What are you struggling with when it comes to monitoring & analyzing your APIs? What are the main areas you could need help with? What features would you like to see?"
            required
          />
          <Select
            name="willingToPay"
            value={formValues.willingToPay}
            onChange={handleChange}
            label="Are you willing to pay?"
            helperText="Would you see yourself or your organization paying for a product like Apilytics?"
            required
          >
            <option value="">---</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
          <Input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            label="Your email"
            placeholder="e.g. john@doe@google.com"
            helperText="We'll reach out to you with this email. You can use your work email or your personal one."
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="mt-8 bg-primary rounded p-4 text-xl text-white w-full">
            Sign up
          </button>
          {submitted && (
            <p className="text-white mt-8">
              Thank you for signing up! We&apos;ll be in touch when you can start using Apilytics!
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;
