import {FC, useState} from "react";
import {Box, Typography, Checkbox} from "@mui/material";
import {
  Folder,
  EditCalendar,
  PersonPin,
  EventAvailable,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useNotify, useRefresh} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {formatDate} from "@/utils/date";
import LetterShow from "@/operations/letters/components/LetterShow";
import {BottomFieldProps, LetterItemProps} from "@/operations/letters/types";
import {useRole} from "@/security/hooks";
import studentLettersProvider from "@/providers/studentLettersProvider";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {isManager} = useRole();
  const notify = useNotify();
  const refresh = useRefresh();

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

  const updateLetterStatus = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    const newStatus = event.target.checked ? "RECEIVED" : "";
    try {
      await studentLettersProvider.saveOrUpdate(
        {id: letter.id, status: newStatus},
        {
          meta: {
            method: "UPDATE",
            studentId: letter.student?.id!,
          },
        }
      );
      notify("Letter status updated successfully", {type: "success"});
      refresh();
    } catch (error) {
      console.error("Error updating letter status:", error);
      notify("Error updating letter status", {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };
  const isChecked = letter.status === "RECEIVED";

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
        {isManager() && isStudentLetter && !isChecked && (
          <Checkbox
            checked={isChecked}
            onChange={updateLetterStatus}
            disabled={isLoading}
            sx={{
              position: "absolute",
              top: "0",
              right: "0",
            }}
          />
        )}
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
