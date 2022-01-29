import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Select } from 'components/shared/Select';
import { usePlausible } from 'hooks/usePlausible';

const FRAMEWORKS = ['Ruby on Rails', 'Laravel', '.NET', 'Spring', 'Flask', 'Other'];

export const FrameworkSelection: React.FC = () => {
  const [value, setValue] = useState('');
  const plausible = usePlausible();

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>): void => {
    setValue(value);
    plausible('setup-framework-select', { value });
  };

  return (
    <>
      <label className="label">
        <span className="label-text">Which framework are you using?</span>
      </label>
      <Select name="framework" value={value} onChange={handleChange} required>
        {FRAMEWORKS.map((val) => (
          <option value={val} key={val}>
            {val}
          </option>
        ))}
      </Select>
    </>
  );
};
