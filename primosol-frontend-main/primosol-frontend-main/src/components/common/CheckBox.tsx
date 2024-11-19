import { Checkbox } from "@headlessui/react";
import { useState, FC } from "react";

type CheckBoxProps = {
  initialEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
  children?: React.ReactNode;
};

const CheckBox: FC<CheckBoxProps> = ({ initialEnabled = false, onChange, className, children }) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleSwitchChange = (newState: boolean) => {
    setEnabled(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <Checkbox
      checked={enabled}
      onChange={handleSwitchChange}
      className={`checkbox font-medium ${className??''} ${enabled ? 'active' : ''}`}
      aria-checked={enabled}
    >
      <span className="checkmark"></span>
      { children }
    </Checkbox>
  );
};

export default CheckBox;
