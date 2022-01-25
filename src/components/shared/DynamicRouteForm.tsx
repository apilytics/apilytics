import React from 'react';
import type { ChangeEvent } from 'react';

import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import type { FormProps } from 'types';

interface Props extends FormProps {
  label: string;
  value: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const DynamicRouteForm: React.FC<Props> = ({
  label,
  value,
  onInputChange,
  ...formProps
}) => (
  <Form {...formProps}>
    <Input
      name="route"
      label={label}
      placeholder="/foo/<id>/bar"
      helperText={
        <>
          The route pattern should be in the following kind format:
          <br />
          <code>{`/foo/<id>/bar`}</code>, where <code>{`<param>`}</code> placeholders indicate
          dynamic values.
        </>
      }
      value={value}
      onChange={onInputChange}
      required
    />
  </Form>
);
