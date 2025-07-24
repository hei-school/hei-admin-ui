import {FC, ReactNode} from "react";
import {SingleMenu} from "./SingleMenu";

export const ListMenuItem: FC<{
  label: string;
  icon: ReactNode;
  to: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: () => void;
}> = ({label, icon, to, target, ...rest}) => (
  <SingleMenu {...{label, to, icon, menu: false, target, ...rest}} />
);
