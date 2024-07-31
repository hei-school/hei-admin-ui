import React from "react";
import {FunctionField} from "react-admin";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";

export default function HaField({source, label, icon, render}) {
  const isLarge = useMediaQuery("(min-width:1700px)");

  const getValue = (record) => {
    const value = render ? render(record) : record[source];
    return value && typeof value === "object" && !React.isValidElement(value)
      ? JSON.stringify(value)
      : value || "Non défini.e";
  };
  return (
    <FunctionField
      render={(record) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            gap="0.5rem"
            width="fit-content"
            padding="4px"
          >
            <Box
              border="0.1px solid"
              borderColor={PALETTE_COLORS.yellow}
              width={isLarge ? "3rem" : "2.5rem"}
              height={isLarge ? "3rem" : "2.5rem"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              bgcolor={PALETTE_COLORS.bgGrey}
              color={PALETTE_COLORS.primary}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: isLarge ? "1.09rem" : "0.9rem",
                  color: PALETTE_COLORS.primary,
                }}
              >
                {label}
              </Typography>
              <Typography variant={isLarge ? "body2" : "caption"}>
                {getValue(record)}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}
