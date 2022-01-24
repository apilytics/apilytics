import React, { useState } from 'react';

import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { Select } from 'components/shared/Select';
import { TextArea } from 'components/shared/TextArea';
import { useAccount } from 'hooks/useAccount';
import { usePlausible } from 'hooks/usePlausible';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';

interface Props {
  title: string;
  isSignUp?: boolean;
}

export const AccountForm: React.FC<Props> = ({ title, isSignUp }) => {
  const { user, setUser } = useAccount();

  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    usedTechnologies: user?.usedTechnologies || '',
    intendedUse: user?.intendedUse || '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const plausible = usePlausible();

  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmittedText('');
    setError('');

    try {
      const res = await fetch(staticApiRoutes.user, {
        method: 'PUT',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data, message } = await res.json();

      if (res.status === 200) {
        setError('');
        setSubmittedText('Account settings saved.');
        plausible('update-account');
        setUser(data);
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
    <Form
      title={title}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      submittedText={submittedText}
    >
      <Input
        name="name"
        label="Account name"
        helperText="This can be either your organization name or your personal one."
        value={formValues.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        label="Your email"
        value={formValues.email}
        onChange={handleChange}
        required
      />
      {isSignUp && (
        <TextArea
          name="usedTechnologies"
          label="What languages and frameworks do you plan to use with Apilytics?"
          value={formValues.usedTechnologies}
          onChange={handleChange}
          required
        />
      )}
      {isSignUp && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              What purpose are you planning to use Apilytics for?{' '}
              <span className="text-error">*</span>
            </span>
          </label>
          <Select
            name="intendedUse"
            value={formValues.intendedUse}
            onChange={handleChange}
            required
          >
            <option value="">---</option>
            <option value="professional">Professional</option>
            <option value="hobby">Hobby</option>
          </Select>
        </div>
      )}
    </Form>
  );
};
