import { Switch } from "@headlessui/react";
import { useState, FC, ReactNode } from "react";

type ToggleButtonProps = {
  initialEnabled?: boolean;
  onSwitchChange?: (enabled: boolean) => void;
  className?: string;
  children?: ReactNode;
};

const ToggleButton: FC<ToggleButtonProps> = ({ initialEnabled = false, onSwitchChange, className, children }) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleSwitchChange = (newState: boolean) => {
    setEnabled(newState);
    if (onSwitchChange) {
      onSwitchChange(newState);
    }
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleSwitchChange}
      className={`relative flex items-center text-md gap-1 h-6 ${className}`}
      aria-checked={enabled}
    >
      <div className={`${enabled?'bg-primary':'bg-gray'} min-w-10 w-10 h-6 p-1 flex items-center rounded-full`}>
        <span
          className={`${enabled ? "translate-x-4" : ""}
            inline-block size-4 transform rounded-full transition-transform bg-white`}
        />
      </div>
      {children}
    </Switch>
  );
};

export default ToggleButton;
