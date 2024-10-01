import {Dialog} from "@/ui/components";
import {FC, ReactNode} from "react";

export const FeesDialog: FC<{
  children: ReactNode;
  title: string;
  show: boolean;
  toggle: () => void;
}> = ({children, title, show, toggle}) => {
  return (
    <Dialog title={title} open={show} onClose={toggle}>
      {children}
    </Dialog>
  );
};
