import React, { useEffect, useMemo } from 'react';
import type { User } from '@prisma/client';

import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { Select } from 'components/shared/Select';
import { TextArea } from 'components/shared/TextArea';
import { Toggle } from 'components/shared/Toggle';
import { useContext } from 'hooks/useContext';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { staticApiRoutes } from 'utils/router';

interface Props {
  title: string;
  isSignUp?: boolean;
}

export const AccountForm: React.FC<Props> = ({ title, isSignUp }) => {
  const { user, setUser } = useContext();
  const { name, email, usedTechnologies, intendedUse, emailPermission } = user ?? {};
  const plausible = usePlausible();

  const initialFormValues = useMemo(
    () => ({
      name,
      email,
      usedTechnologies,
      intendedUse,
      emailPermission,
    }),
    [email, emailPermission, intendedUse, name, usedTechnologies],
  );

  const { submitting, onInputChange, formValues, setFormValues, submitForm } =
    useForm(initialFormValues);

  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues, setFormValues]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    submitForm<User>({
      url: staticApiRoutes.user,
      options: {
        method: 'PUT',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }): void => {
        plausible('update-account');
        setUser(data);
      },
    });
  };

  return (
    <Form title={title} onSubmit={handleSubmit} submitting={submitting}>
      <Input
        name="name"
        label="Account name"
        helperText="This can be either your organization name or your personal one."
        value={formValues.name}
        onChange={onInputChange}
        required
      />
      <Input
        name="email"
        label="Your email"
        value={formValues.email}
        onChange={onInputChange}
        required
      />
      {isSignUp && (
        <TextArea
          name="usedTechnologies"
          label="What languages and frameworks do you plan to use with Apilytics?"
          value={formValues.usedTechnologies}
          onChange={onInputChange}
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
            onChange={onInputChange}
            required
          >
            <option value="">---</option>
            <option value="professional">Professional</option>
            <option value="hobby">Hobby</option>
          </Select>
        </div>
      )}
      {!isSignUp && (
        <Toggle
          label="Email permission"
          helperText="This includes email reports and other important updates."
          name="emailPermission"
          value={formValues.emailPermission ? 'true' : 'false'}
          checked={formValues.emailPermission}
          onChange={onInputChange}
        />
      )}
    </Form>
  );
};
