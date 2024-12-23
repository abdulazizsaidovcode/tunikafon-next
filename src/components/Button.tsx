import { Button as MaterialButton, ButtonProps } from "@material-tailwind/react";

export function Button(props: Partial<ButtonProps>) {
  return (
    <MaterialButton
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
} 