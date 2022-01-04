import React from 'react';
import type { FormEvent } from 'react';

import { Button } from 'components/shared/Button';

interface Props {
  title?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error: string;
  loading: boolean;
  submittedText?: string;
}

export const Form: React.FC<Props> = ({
  title,
  onSubmit,
  error,
  loading,
  submittedText,
  children,
}) => (
  <>
    {title && <h2 className="text-2xl">{title}</h2>}
    <form onSubmit={onSubmit} className="mt-4">
      {children}
      {error && <p className="text-error">{error}</p>}
      {submittedText && <p className="mt-4 label-text">{submittedText}</p>}
      <Button loading={loading} fullWidth type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  </>
);
