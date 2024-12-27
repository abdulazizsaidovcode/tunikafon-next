import { 
  Accordion as MaterialAccordion, 
  AccordionProps,
  AccordionHeader as MaterialAccordionHeader,
  AccordionHeaderProps,
  AccordionBody as MaterialAccordionBody,
  AccordionBodyProps
} from "@material-tailwind/react";

export function Accordion(props: Partial<AccordionProps>) {
  return (
    <MaterialAccordion
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
}

export function AccordionHeader(props: Partial<AccordionHeaderProps>) {
  return (
    <MaterialAccordionHeader
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
}

export function AccordionBody(props: Partial<AccordionBodyProps>) {
  return (
    <MaterialAccordionBody
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
} 