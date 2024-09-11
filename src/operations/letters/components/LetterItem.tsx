import React, {FC} from "react";
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  Popover,
  Button,
} from "@mui/material";
import {
  Folder,
  EditCalendar,
  PersonPin,
  EventAvailable,
  PanoramaFishEye,
  MoreVert,
  CheckCircle,
  Unpublished,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {formatDate} from "@/utils/date";
import LetterShow from "@/operations/letters/LetterShow";
import {
  BottomFieldProps,
  LetterItemProps,
  PopoverProps,
} from "@/operations/letters/types";
import {useRole} from "@/security/hooks";
const STATUS_COLORS = {
  RECEIVED: {border: "green", background: "green"},
  REJECTED: {border: "#dc3545", background: "#dc3545"},
  PENDING: {border: PALETTE_COLORS.yellow, background: PALETTE_COLORS.yellow},
} as const;

const ITEMS_STYLE = {
  width: "300px",
  position: "relative",
  boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.4)",
  marginBlock: "1.5rem",
  borderRadius: "12px",
  borderBottom: "1rem solid",
  padding: "1rem",
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

export const LetterItem: FC<LetterItemProps> = ({letter, isStudentLetter}) => {
  const [isOpen, , onClose] = useToggle();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const navigate = useNavigate();
  const {isManager} = useRole();

  const creationDate = formatDate(letter.creation_datetime!, false);
  const aprovalDate = formatDate(letter.approval_datetime!, false);

  const studentName = `${letter.student?.first_name} ${letter.student?.last_name}`;
  const isDateAproved = letter.approval_datetime !== null;

  const handleItemClick = () => {
    if (isStudentLetter) {
      onClose();
    } else {
      navigate(`/students/${letter.student?.id}/show`);
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
          <Box
            sx={{
              "position": "absolute",
              "top": "8px",
              "right": "8px",
              "display": "flex",
              "alignItems": "center",
              "gap": "0rem",
              "justifyContent": "center",
              "& .css-kcjtf1-MuiButtonBase-root-MuiCheckbox-root": {
                padding: "0 !important",
              },
            }}
          >
            <Checkbox
              checked={isChecked}
              icon={
                <PanoramaFishEye
                  sx={{
                    color: PALETTE_COLORS.primary,
                    fontSize: "1.2rem",
                  }}
                />
              }
            />
            <IconButton
              sx={{
                padding: "0 !important",
              }}
              onClick={handleClick}
            >
              <MoreVert
                sx={{
                  fontSize: "1.2rem",
                }}
              />
            </IconButton>
            <LetterItemActions
              anchorEl={anchorEl}
              onClose={handleClose}
              open={open}
            />
          </Box>
        )}
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.2)",
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
              textAlign: "justify",
              paddingBlock: "1rem",
            }}
          >
            {letter.description}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="1vh"
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
          onClose={onClose}
          fileUrl={letter.file_url ?? ""}
          filename={letter.student?.first_name!}
        />
      )}
    </>
  );
};

const LetterItemActions: FC<PopoverProps> = ({anchorEl, open, onClose}) => {
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            width: "150px",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Button
            startIcon={<CheckCircle />}
            sx={{
              "color": "green",
              "width": "100%",
              "display": "flex",
              "justifyContent": "flex-start",
              "backgroundColor": "#c8e6c9",
              "&:hover": {
                backgroundColor: "#81c784",
                color: "white",
              },
            }}
          >
            Accepter
          </Button>
          <Button
            startIcon={<Unpublished />}
            sx={{
              "color": "#d84315",
              "width": "100%",
              "display": "flex",
              "justifyContent": "flex-start",
              "backgroundColor": "#ffccbc",
              "&:hover": {
                backgroundColor: "#ff8a65",
                color: "white",
              },
            }}
          >
            Réfuser
          </Button>
        </Box>
      </Popover>
    </>
  );
};

const BottomField: FC<BottomFieldProps> = ({text, icon}) => (
  <Box
    sx={{
      "display": "flex",
      "gap": "10px",
      "alignItems": "center",
      "& .MuiSvgIcon-root": {
        color: PALETTE_COLORS.primary,
      },
    }}
  >
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Box>
);
