import { ClipboardCopyIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

import { Input } from 'components/shared/Input';
import { staticRoutes } from 'utils/router';

interface Props {
  value: string;
  apiKeyCopiedCallback: () => void;
}

export const ApiKeyField: React.FC<Props> = ({ value, apiKeyCopiedCallback }) => {
  const onClick = (): void => {
    navigator.clipboard.writeText(value);
    apiKeyCopiedCallback();
  };

  const renderHelperText = (
    <>
      Use this API key with Apilytics middleware. See our{' '}
      <Link href={staticRoutes.docs}>
        <a>documentation</a>
      </Link>{' '}
      for more information.
    </>
  );

  return (
    <Input
      name="apiKey"
      label="Your API Key"
      value={value}
      readOnly
      endIcon={ClipboardCopyIcon}
      buttonProps={{
        onClick,
        tooltip: 'Copy your API key to the clipboard.',
        tooltipProps: { className: 'tooltip-left' },
      }}
      helperText={renderHelperText}
    />
  );
};
