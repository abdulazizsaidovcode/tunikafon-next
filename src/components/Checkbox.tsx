import { Checkbox as MaterialCheckbox, CheckboxProps } from "@material-tailwind/react";

export function Checkbox(props: Partial<CheckboxProps>) {
  return (
    <MaterialCheckbox
      {...props}
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
      crossOrigin=""
    />
  );
} 