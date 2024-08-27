import React from 'react';

interface InputType {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
  value?: string | number;
  placeholder?: string
}

const Input: React.FC<InputType> = ({
  onChange,
  type = 'text',
  label,
  value,
  placeholder,
}) => {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input
        placeholder={`${placeholder ? placeholder : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        accept=".png, .jpg"
        className="mb-4 w-full py-2 px-4 border rounded outline-none bg-transparent"
      />
    </div>
  );
};

export default Input;
