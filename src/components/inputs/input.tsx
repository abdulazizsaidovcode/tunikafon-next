interface InputType {
  onChange?: () => void;
  type?: string;
  label?: string;
}

const Input = ({ onChange, type, label }: InputType) => {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input type={type ? type : 'text'} onChange={onChange} className="mb-4" />
    </div>
  );
};

export default Input;
