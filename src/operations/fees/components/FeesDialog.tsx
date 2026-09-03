import {Dialog} from "@/ui/components";
import {ReactNode} from "react";

type FeesDialogProps = {
  children: ReactNode;
  title: string;
  show: boolean;
  toggle: () => void;
};

export const FeesDialog = ({
  children,
  title,
  show,
  toggle,
}: FeesDialogProps) => {
  return (
    <Dialog title={title} open={show} onClose={toggle}>
      {children}
    </Dialog>
  );
};
