import {Cancel} from "@mui/icons-material";
import {IconButton, MenuItem} from "@mui/material";
import {ReactNode} from "react";
import {getObjValue} from "../../../utils";

export interface SelectFilterItem {
  label: ReactNode;
  value: string | number;
}

interface ItemsProps {
  options: ReadonlyArray<Record<string, unknown>>;
  labelKey: string;
  valueKey: string;
  onClick: (item: SelectFilterItem) => void;
  checked: (item: SelectFilterItem) => boolean;
}

export const Items = ({
  options,
  labelKey,
  valueKey,
  onClick,
  checked,
}: Readonly<ItemsProps>) => {
  return options.map((el) => {
    // labelKey and valueKey point to displayable values of the option
    const currentItem: SelectFilterItem = {
      label: getObjValue(el, labelKey) as ReactNode,
      value: getObjValue(el, valueKey) as SelectFilterItem["value"],
    };
    return (
      <MenuItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 0.7,
        }}
        onClick={() => onClick(currentItem)}
        key={currentItem.value}
        value={currentItem.value}
      >
        {currentItem.label}
        {checked(currentItem) && (
          <IconButton sx={{p: 0}} size="small">
            <Cancel />
          </IconButton>
        )}
      </MenuItem>
    );
  });
};
