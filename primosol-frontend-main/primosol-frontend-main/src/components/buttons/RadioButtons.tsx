import { RadioGroup } from "@headlessui/react";
import { useState, FC } from "react";

type Option = {
  value: string;
  label: string;
};

type RadioButtonsProps = {
  options: Option[];
  defaultValue?: string;
  className?: string;
  onChange: (value: string) => void;
};

const RadioButtons: FC<RadioButtonsProps> = ({ className, options, defaultValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0].value);

  return (
    <RadioGroup
      value={selectedValue}
      onChange={(value) => {
        setSelectedValue(value);
        onChange(value);
      }}
    >
      <div className={className}>
        {options.map((option) => (
          <RadioGroup.Option key={option.value} value={option.value} as="div" className="flex items-center cursor-pointer">
            {({ checked }) => (
              <>
                <span className={`size-4 rounded-full border flex items-center justify-center ${
                  checked ? 'border-yellow' : 'border-gray'
                }`}>
                  {checked && <div className="inline-block w-2.5 h-2.5 rounded-full bg-soft-white"></div>}
                </span>
                <RadioGroup.Label as="span" className={`block ml-2 text-normal ${
                  checked ? '' : 'text-gray'
                }`}>
                  {option.label}
                </RadioGroup.Label>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioButtons;
