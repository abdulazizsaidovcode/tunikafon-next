import { 
  MenuList as MaterialMenuList, 
  MenuListProps,
  MenuItem as MaterialMenuItem,
  MenuItemProps 
} from "@material-tailwind/react";

export function MenuList(props: Partial<MenuListProps>) {
  return (
    <MaterialMenuList
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
}

export function MenuItem(props: Partial<MenuItemProps>) {
  return (
    <MaterialMenuItem
      {...props}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  );
} 