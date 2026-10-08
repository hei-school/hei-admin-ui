import {Box, Popover} from "@mui/material";
import {ReactNode, useMemo} from "react";
import {HaListContext} from "./HaListTitle";

export const ListActionsPopover = ({
  anchorEl,
  onClose,
  children,
}: Readonly<{
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: ReactNode;
}>) => {
  const listContext = useMemo(() => ({closeAction: onClose}), [onClose]);

  return (
    <HaListContext.Provider value={listContext}>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Box sx={{width: "150px"}}>{children}</Box>
      </Popover>
    </HaListContext.Provider>
  );
};
