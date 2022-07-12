import clsx from 'clsx';
import React from 'react';

import { Button } from 'components/shared/Button';
import type { FormProps } from 'types';

export const Form: React.FC<FormProps> = ({
  title,
  subTitle,
  onSubmit,
  contentAfter,
  submitting,
  className,
  submitButtonText = 'Submit',
  children,
  ...props
}) => (
  <form onSubmit={onSubmit} className={clsx('text-left', className)} {...props}>
    {title && <h5 className="text-white">{title}</h5>}
    {subTitle && <p className="text-sm">{subTitle}</p>}
    {children}
    <Button
      className="btn-primary mt-4"
      loading={submitting}
      disabled={submitting}
      type="submit"
      fullWidth
    >
      {submitButtonText}
    </Button>
    {contentAfter}
  </form>
);
