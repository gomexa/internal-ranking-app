'use client';

import { Select } from '@/components/ui';
import { getCurrentSeason } from '@/lib/constants';

interface SeasonSelectorProps {
  value: number;
  onChange: (season: number) => void;
}

export function SeasonSelector({ value, onChange }: SeasonSelectorProps) {
  const currentYear = getCurrentSeason();
  const years = Array.from({ length: 1 }, (_, i) => currentYear - i);

  const options = years.map((year) => ({
    value: year.toString(),
    label: `Temporada ${year}`,
  }));

  return (
    <div className="w-48">
      <Select
        value={value.toString()}
        onChange={(e) => onChange(parseInt(e.target.value))}
        options={options}
      />
    </div>
  );
}
