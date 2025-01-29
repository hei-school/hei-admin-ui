import {PALETTE_COLORS} from "@/haTheme";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {FunctionField, SimpleShowLayout} from "react-admin";

export default function HaField({source, label, icon, render}) {
  const isLarge = useMediaQuery("(min-width:1700px)");

  const getValue = (record) => {
    return render ? render(record) : record[source];
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row ",
        width: "100%",
      }}
    >
      <Box
        border="0.1px solid"
        borderColor={PALETTE_COLORS.yellow}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        bgcolor={PALETTE_COLORS.bgGrey}
        color={PALETTE_COLORS.primary}
        padding={isLarge ? "1rem" : "0.7rem"}
      >
        {icon}
      </Box>
      <SimpleShowLayout>
        <FunctionField
          label={
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: isLarge ? "1.2rem" : "0.9rem",
                color: PALETTE_COLORS.primary,
              }}
            >
              {label}
            </Typography>
          }
          emptyText="Non défini.e"
          render={(record) => {
            return (
              <Typography variant={isLarge ? "subtitle1" : "caption"}>
                {getValue(record) || "Non défini.e"}
              </Typography>
            );
          }}
          sx={{
            width: "100%",
          }}
        />
      </SimpleShowLayout>
    </Box>
  );
}
