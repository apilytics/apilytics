import React from 'react';
import type { FormEvent } from 'react';

import { Button } from 'components/shared/Button';

interface Props {
  title?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error: string;
  loading?: boolean;
  submittedText?: string;
  secondaryContent?: React.ReactNode;
}

export const Form: React.FC<Props> = ({
  title,
  onSubmit,
  error,
  loading,
  submittedText,
  secondaryContent,
  children,
}) => (
  <div className="card rounded-lg p-4 shadow bg-base-100">
    {title && <h2 className="text-2xl">{title}</h2>}
    <form onSubmit={onSubmit} className="mt-4 text-left">
      {children}
      {error && (
        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text text-error">{error}</span>
          </label>
        </div>
      )}
      {submittedText && (
        <div className="form-control mt-2">
          <label className="label">
            <span className="label-text">{submittedText}</span>
          </label>
        </div>
      )}
      <Button className="btn-primary mt-4" loading={loading} type="submit" fullWidth>
        Submit
      </Button>
      {secondaryContent}
    </form>
  </div>
);
