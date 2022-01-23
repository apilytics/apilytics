import React from 'react';

import { Button } from 'components/shared/Button';
import type { FormProps } from 'types';

export const Form: React.FC<FormProps> = ({
  title,
  subTitle,
  onSubmit,
  error,
  loading,
  submittedText,
  secondaryContent,
  renderAlert,
  children,
}) => (
  <div className="card rounded-lg p-4 shadow bg-base-100">
    {renderAlert}
    {title && <h5 className="text-white">{title}</h5>}
    {subTitle && <p className="text-sm">{subTitle}</p>}
    <form onSubmit={onSubmit} className="mt-4 text-left">
      {children}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
      {submittedText && (
        <label className="label">
          <span className="label-text-alt text-white">{submittedText}</span>
        </label>
      )}
      <Button className="btn-primary mt-4" loading={loading} type="submit" fullWidth>
        Submit
      </Button>
      {secondaryContent}
    </form>
  </div>
);
