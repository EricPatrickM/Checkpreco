import { ChangeEvent, MouseEventHandler } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onClick?: MouseEventHandler<HTMLInputElement>;
}

export function Input({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  min,
  defaultValue,
  onChange,
  onFocus,
  value,
  onClick,
  list,
  autoComplete,
  disabled,
}: InputProps) {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        min={min}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onClick={onClick}
        disabled={disabled}
        list={list}
        autoComplete={autoComplete}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
}
