import { InputHTMLAttributes, ReactNode, forwardRef, useEffect, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  required?: boolean;
  children?: ReactNode;
  information?: string;
  highlight?: string;
  onHighlight?: () => void;
  validation?: string;
  readOnly?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, highlight, onHighlight, required, children, information, className, validation, readOnly, ...inputProps }, ref) => {
    const [value, setValue] = useState<string | number | readonly string[] | undefined>();

    useEffect(() => {
      setValue(inputProps.value);
    }, [inputProps.value]);
    
    return (
      <div className="flex flex-col gap-1">
        {label ? 
        <div className="flex justify-between text-xs mx-2">
          <span className="text-gray">{label}</span>
          <span className="cursor-pointer" onClick={onHighlight}>{highlight}</span>
        </div> : null}

        <div className={`input rounded-lg ${className??''}`}>
          <input
            ref={ref}
            type={inputProps.type}
            value={value} 
            min={0}
            className="text-sm"
            onChange={e => {
              setValue(e.target.value);
              inputProps.onChange && inputProps.onChange(e);
            }}
            {...inputProps}
          />
          {children && <div className="flex items-center h-full right-4">{children}</div>}
        </div>
      </div>
    );
  }
);

export default Input;
