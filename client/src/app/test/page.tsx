import { Select } from '@/components/core';

export default function Test() {
  return (
    <div>
      <Select
        label='Guests'
        options={[
          { id: 'florida', label: 'Florida' },
          { id: 'delaware', label: 'Delaware' },
          { id: 'california', label: 'California' },
          { id: 'texas', label: 'Texas' },
        ]}
      />
    </div>
  );
}
