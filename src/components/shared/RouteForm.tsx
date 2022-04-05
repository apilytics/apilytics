import React from 'react';
import type { ChangeEvent } from 'react';

import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import type { FormProps } from 'types';

interface Props extends FormProps {
  label: string;
  routeName: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  helperText?: JSX.Element;
}

export const RouteForm: React.FC<Props> = ({
  label,
  routeName,
  onInputChange,
  helperText,
  ...formProps
}) => (
  <Form {...formProps}>
    <Input
      name="routeName"
      label={label}
      placeholder="/foo/<id>/bar"
      helperText={helperText}
      value={routeName}
      onChange={onInputChange}
      required
    />
  </Form>
);
