import {FC, ReactNode} from "react";
import {Box, Typography, IconButton} from "@mui/material";
import {Folder, EditCalendar, PersonPin, MoreVert} from "@mui/icons-material";
import {Letter} from "@haapi/typescript-client";
import {PALETTE_COLORS} from "@/haTheme";
import {formatDate} from "@/utils/date";

interface LetterItemProps {
  letter: Letter;
}

const statusColors = {
  APPROVED: {border: "#4de852", background: "#4de852"},
  REJECTED: {border: "#dc3545", background: "#dc3545"},
  PENDING: {border: "#ffcf5c", background: "#ffcf5c"},
};
const itemsStyle = {
  width: "300px",
  minHeight: "170px",
  position: "relative",
  boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.4)",
  marginBlock: "0.5rem",
  borderRadius: "12px",
  borderBottom: "1rem solid",
};
const iconStyle = {
  width: "55px",
  height: "55px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  position: "absolute",
  top: "-27.5px",
  left: "15px",
};

const LetterItem: FC<LetterItemProps> = ({letter}) => {
  const creationDate = formatDate(letter.creation_datetime!, false);
  const colors = statusColors[letter.status as keyof typeof statusColors] || {
    border: "#ffcf5c",
    background: "#ffcf5c",
  };
  return (
    <Box sx={{...itemsStyle, borderColor: colors.border}}>
      <Box
        sx={{
          ...iconStyle,
          backgroundColor: colors.background,
        }}
      >
        <Folder sx={{fontSize: "2.5rem", color: "white"}} />
      </Box>
      <IconButton sx={{position: "absolute", top: "8px", right: "0"}}>
        <MoreVert />
      </IconButton>
      <Typography
        sx={{
          textAlign: "right",
          paddingTop: "15px",
          fontWeight: "800",
          paddingRight: "2.6rem",
        }}
      >
        HEI-{letter.ref}
      </Typography>
      <Typography
        sx={{
          padding: "1rem",
          textAlign: "justify",
        }}
      >
        {letter.description}
      </Typography>
      <Box
        sx={{
          paddingInline: "1rem",
          paddingBottom: "0.1rem",
        }}
      >
        <BottomField text={creationDate} icon={<EditCalendar />} />
        <BottomField text={letter.student_ref!} icon={<PersonPin />} />
      </Box>
    </Box>
  );
};
export default LetterItem;

const BottomField: FC<{
  text: string;
  icon: ReactNode;
}> = ({text, icon}) => {
  return (
    <Box
      sx={{
        "display": "flex",
        "gap": "8px",
        "alignItems": "center",
        "marginBlock": "1rem",
        "& .MuiSvgIcon-root": {
          color: PALETTE_COLORS.primary,
        },
      }}
    >
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};
