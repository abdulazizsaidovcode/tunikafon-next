import { Select as MaterialSelect, SelectProps } from "@material-tailwind/react";

export function Select(props: Partial<SelectProps>) {
  return (
    <MaterialSelect
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
} 