import type { ChangeEvent, FormEvent } from 'react';

import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { Radio } from 'components/shared/Radio';
import { ORIGIN_ROLES } from 'utils/constants';
import type { OriginUserData } from 'types';

interface Props {
  onSubmit: (e: FormEvent) => void;
  formValues: OriginUserData;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  emailInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  loading: boolean;
}

export const OriginUserForm: React.FC<Props> = ({
  onSubmit,
  formValues: { email, role },
  onInputChange,
  emailInputProps,
  loading,
}) => (
  <form onSubmit={onSubmit} className="p-4">
    <Input
      label="Email"
      name="email"
      type="email"
      value={email}
      onChange={onInputChange}
      required
      {...emailInputProps}
    />
    <Radio
      label="Viewer"
      name="role"
      value={ORIGIN_ROLES.VIEWER}
      checked={role === ORIGIN_ROLES.VIEWER}
      onChange={onInputChange}
      helperText="Can view stats but not edit any settings or invite new members."
      className="mt-4"
    />
    <div className="divider" />
    <Radio
      label="Admin"
      name="role"
      value={ORIGIN_ROLES.ADMIN}
      checked={role === ORIGIN_ROLES.ADMIN}
      onChange={onInputChange}
      helperText="Can view stats, edit settings and invite new members."
    />
    <Button type="submit" className="btn-primary mt-4" fullWidth loading={loading}>
      Save
    </Button>
  </form>
);
