import debounce from 'lodash.debounce';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

const DebouncedInput = forwardRef((props: any, ref) => {
  const { debounceTimeout = 600, onChange, ...otherProps } = props;
  const [internalValue, setInternalValue] = useState(props.value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(props.value);
  }, [props.value]);

  const debouncedChange = useCallback(debounce(onChange, debounceTimeout), [onChange, debounceTimeout]);

  const handleChange = (event: any) => {
    setInternalValue(event.target.value);
    debouncedChange(event.target.value);
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  return <input {...otherProps} value={internalValue} onChange={handleChange} ref={inputRef} />;
});

export default DebouncedInput;
