import {FC, ReactNode} from "react";
import {Box, Typography, IconButton} from "@mui/material";
import {
  Folder,
  EditCalendar,
  PersonPin,
  MoreVert,
  EventAvailable,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {Letter} from "@haapi/typescript-client";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";

import {formatDate} from "@/utils/date";
import LetterShow from "./LetterShow";

interface LetterItemProps {
  letter: Letter;
  isStudentLetters?: boolean;
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
  marginBlock: "1rem",
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

const LetterItem: FC<LetterItemProps> = ({letter, isStudentLetters}) => {
  const [isOpen, , toggle] = useToggle();
  const navigate = useNavigate();

  const creationDate = formatDate(letter.creation_datetime!, false);
  const aprovalDate = formatDate(letter.approval_datetime!, false);
  const colors = statusColors[letter.status as keyof typeof statusColors] || {
    border: "#ffcf5c",
    background: "#ffcf5c",
  };
  const studentName = `${letter.student?.first_name} ${letter.student?.last_name}`;
  const isDateAproved = letter.approval_datetime !== null;
  const handleItemClick = () => {
    if (isStudentLetters) {
      toggle();
    } else {
      navigate(`/students/${letter.student?.id}/show`);
    }
  };

  return (
    <>
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
        <Box
          onClick={handleItemClick}
          sx={{cursor: "pointer", backgroundColor: "whitesmoke"}}
        >
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
            <BottomField text={studentName} icon={<PersonPin />} />
            {isDateAproved && (
              <BottomField text={aprovalDate} icon={<EventAvailable />} />
            )}
          </Box>
        </Box>
      </Box>
      {isStudentLetters && (
        <LetterShow
          isOpen={isOpen}
          toggle={toggle}
          fileUrl={letter.file_url ?? ""}
          filename={letter.student?.first_name!}
        />
      )}
    </>
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
