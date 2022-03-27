import Link from 'next/link';
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Select } from 'components/shared/Select';
import { usePlausible } from 'hooks/usePlausible';
import { staticRoutes } from 'utils/router';

const FRAMEWORKS = ['Ruby on Rails', 'Laravel', '.NET', 'Spring', 'Go net/http', 'Gin', 'Other'];

export const FrameworkSelection: React.FC = () => {
  const [value, setValue] = useState('');
  const [textVisible, setTextVisible] = useState(false);
  const plausible = usePlausible();

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>): void => {
    setValue(value);
    plausible('setup-framework-select', { value });

    if (!textVisible) {
      setTextVisible(true);
    }
  };

  return (
    <>
      <p>Which framework are you using?</p>
      <Select name="framework" value={value} onChange={handleChange} required className="my-4">
        {FRAMEWORKS.map((val) => (
          <option value={val} key={val}>
            {val}
          </option>
        ))}
      </Select>
      {textVisible && (
        <p>
          If your backend supports none of our open source middlewares, we have tools to help you
          with creating your own middleware. See our <Link href={staticRoutes.byom}>docs</Link> for
          more information.
        </p>
      )}
    </>
  );
};
