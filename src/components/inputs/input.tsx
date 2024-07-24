import React from 'react';

interface InputType {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
  value?: string; 
}

const Input: React.FC<InputType> = ({
  onChange,
  type = 'text',
  label,
  value,
}) => {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mb-4 w-full p-2 border rounded"
      />
    </div>
  );
};

export default Input;
