import {HTMLAttributeAnchorTarget, ReactNode} from "react";
import {SingleMenu} from "./SingleMenu";

type ListMenuItemProps = {
  label: string;
  icon: ReactNode;
  to: string;
  target?: HTMLAttributeAnchorTarget;
  onClick?: () => void;
};

export const ListMenuItem = ({
  label,
  icon,
  to,
  target,
  onClick,
}: Readonly<ListMenuItemProps>) => (
  <SingleMenu {...{label, to, icon, menu: false, target, onClick}} />
);
