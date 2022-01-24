import { ClipboardCopyIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useState } from 'react';

import { IconButton } from 'components/shared/IconButton';
import { usePlausible } from 'hooks/usePlausible';
import { staticRoutes } from 'utils/router';

interface Props {
  value: string;
}

export const ApiKeyField: React.FC<Props> = ({ value }) => {
  const plausible = usePlausible();
  const [isCopied, setIsCopied] = useState(false);

  const onClick = (): void => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    plausible('copy-api-key');
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Your API Key</span>
      </label>
      <div className="flex">
        <input
          name="apiKey"
          value={value}
          className="input input-primary rounded-r-none grow"
          readOnly
        />
        <IconButton
          type="button"
          onClick={onClick}
          icon={ClipboardCopyIcon}
          tooltip="Copy your API key to the clipboard."
          tooltipProps={{ className: 'tooltip-left' }}
          className="rounded-l-none btn-outline btn-primary border-l-0"
        />
      </div>
      <label className="label">
        <span className="label-text-alt">
          Use this API key with Apilytics middleware. See our{' '}
          <Link href={staticRoutes.docs}>
            <a>documentation</a>
          </Link>{' '}
          for more information.
        </span>
      </label>
      {isCopied && (
        <label className="label">
          <span className="label-text-alt text-white">API key copied to the clipboard.</span>
        </label>
      )}
    </div>
  );
};
