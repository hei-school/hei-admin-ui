import {FunctionField} from "react-admin";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";
import React from "react";
export default function ProfilField({source, label, icon, render}) {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <FunctionField
      render={(record) => {
        const value = render ? render(record) : record[source];
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
              width={isLarge ? "4rem" : "2.5rem"}
              height={isLarge ? "4rem" : "2.5rem"}
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
                  fontSize: isLarge ? "1.5rem" : "0.9rem",
                  color: PALETTE_COLORS.primary,
                }}
              >
                {label}
              </Typography>
              <Typography variant={isLarge ? "h6" : "caption"}>
                {value &&
                typeof value === "object" &&
                !React.isValidElement(value)
                  ? JSON.stringify(value)
                  : value || "Non défini.e"}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}
