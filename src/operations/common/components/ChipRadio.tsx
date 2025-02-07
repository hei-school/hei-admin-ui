import {Chip, ChipOwnProps, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";

interface Item {
  value: string;
  label: string;
  color: ChipOwnProps["color"];
}

interface RadioProps {
  choices: Item[];
  label: string;
  row?: boolean;
  onChange: (selectedItems: string) => void;
  defaultSelected?: string;
  sx?: object;
  enable?: boolean;
}

export const ChipRadio = ({
  choices,
  label,
  row,
  onChange,
  defaultSelected,
  enable = true,
  sx = {},
  ...props
}: RadioProps) => {
  const [radio, setRadio] = useState(defaultSelected as string);

  useEffect(() => {
    setRadio((defaultSelected as string) || "");
  }, [defaultSelected]);

  const handleItemChange = (item: string) => {
    setRadio(item);
    onChange(item);
  };

  return (
    <Stack
      direction={row ? "row" : "column"}
      justifyContent="space-between"
      sx={{gap: 1, ...sx}}
      {...props}
    >
      <Typography>{label}</Typography>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {choices.map(({label, value, color}, index) => {
          const isSelected = radio === value;
          return (
            <Chip
              size="small"
              key={`${label}-${index}`}
              label={label}
              onClick={() => enable && handleItemChange(value)}
              color={color}
              data-testid={value}
              variant={isSelected ? "filled" : "outlined"}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};
