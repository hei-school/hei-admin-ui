import {PALETTE_COLORS} from "@/haTheme";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {ReactNode} from "react";
import {FunctionField, RaRecord, SimpleShowLayout} from "react-admin";

interface HaFieldProps<RecordType extends object> {
  source?: string;
  label: ReactNode;
  icon: ReactNode;
  render?: (record: RecordType) => ReactNode;
}

const HaField = <RecordType extends object = RaRecord>({
  source,
  label,
  icon,
  render,
}: Readonly<HaFieldProps<RecordType>>) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  const getValue = (record: RecordType): ReactNode => {
    if (render) return render(record);
    return source === undefined
      ? undefined
      : (record as Record<string, ReactNode>)[source];
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
        <FunctionField<RaRecord>
          label={
            <Typography
              variant="subtitle2"
              component="span"
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
                {getValue(record as RecordType) || "Non défini.e"}
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
};

export default HaField;
