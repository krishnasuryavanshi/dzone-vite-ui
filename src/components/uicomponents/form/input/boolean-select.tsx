import { Select } from './select';

interface BooleanSelectProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  options: { label: string; value: boolean }[];
  className: string;
}

export const BooleanSelect: React.FC<BooleanSelectProps> = ({
  value,
  onChange,
  options,
  className,
}) => {
  const convertedOptions = options.map((option) => ({
    label: option.label,
    value: option.value ? 'true' : 'false',
  }));

  return (
    <Select
      value={value ? 'true' : 'false'}
      className={className}
      onChange={(selectedValue: string) => {
        onChange?.(selectedValue === 'true');
      }}
      options={convertedOptions}
    />
  );
};
