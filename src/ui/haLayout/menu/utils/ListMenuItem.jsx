import {SingleMenu} from "./SingleMenu";

export const ListMenuItem = ({label, icon, to, target, ...rest}) => (
  <SingleMenu {...{label, to, icon, menu: false, target, ...rest}} />
);
