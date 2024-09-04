import {FC} from "react";
import {Box, Typography, IconButton} from "@mui/material";
import {
  Folder,
  EditCalendar,
  PersonPin,
  MoreVert,
  EventAvailable,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {formatDate} from "@/utils/date";
import LetterShow from "@/operations/letters/components/LetterShow";
import {BottomFieldProps, LetterItemProps} from "@/operations/letters/types";

const STATUS_COLORS = {
  RECEIVED: {border: "#4de852", background: "#4de852"},
  REJECTED: {border: "#dc3545", background: "#dc3545"},
  PENDING: {border: "#ffcf5c", background: "#ffcf5c"},
} as const;

const ITEMS_STYLE = {
  minWidth: "300px",
  minHeight: "170px",
  position: "relative",
  boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.4)",
  marginBlock: "1rem",
  borderRadius: "12px",
  borderBottom: "1rem solid",
};

const ICON_STYLE = {
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

const LetterItem: FC<LetterItemProps> = ({letter, isStudentLetter}) => {
  const [isOpen, , toggle] = useToggle();
  const navigate = useNavigate();

  const creationDate = formatDate(letter.creation_datetime!, false);
  const aprovalDate = formatDate(letter.approval_datetime!, false);

  const studentName = `${letter.student?.first_name} ${letter.student?.last_name}`;
  const isDateAproved = letter.approval_datetime !== null;

  const handleItemClick = () => {
    if (isStudentLetter) {
      toggle();
    } else {
      navigate(`/students/${letter.student?.id}/show`);
    }
  };

  return (
    <>
      <Box
        sx={{
          ...ITEMS_STYLE,
          borderColor: STATUS_COLORS[letter.status!].border,
        }}
      >
        <Box
          sx={{
            ...ICON_STYLE,
            backgroundColor: STATUS_COLORS[letter.status!].background,
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
      {isStudentLetter && (
        <LetterShow
          isOpen={isOpen}
          onToggle={toggle}
          fileUrl={letter.file_url ?? ""}
          filename={letter.student?.first_name!}
        />
      )}
    </>
  );
};

const BottomField: FC<BottomFieldProps> = ({text, icon}) => (
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

export default LetterItem;
