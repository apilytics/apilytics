import { ClipboardCopyIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

import { IconButton } from 'components/shared/IconButton';
import { useContext } from 'hooks/useContext';
import { usePlausible } from 'hooks/usePlausible';
import { staticRoutes } from 'utils/router';

interface Props {
  value: string;
  onClickCallback?: () => void;
}

export const ApiKeyField: React.FC<Props> = ({ value, onClickCallback }) => {
  const plausible = usePlausible();
  const { setSuccessMessage } = useContext();

  const onClick = (): void => {
    navigator.clipboard.writeText(value);
    setSuccessMessage('API key copied to the clipboard.');
    plausible('copy-api-key');

    if (onClickCallback) {
      onClickCallback();
    }
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
          className="input-primary input grow rounded-r-none"
          readOnly
        />
        <IconButton
          type="button"
          onClick={onClick}
          icon={ClipboardCopyIcon}
          className="btn-outline btn-primary rounded-l-none border-l-0"
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
    </div>
  );
};
