import React, {FC} from "react";
import {
  Box,
  Typography,
  IconButton,
  Popover,
  useMediaQuery,
} from "@mui/material";
import {
  Folder,
  EditCalendar,
  EventAvailable,
  MoreVert,
} from "@mui/icons-material";

import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {formatDate} from "@/utils/date";
import LetterShow from "@/operations/letters/LetterShow";
import {
  BottomFieldProps,
  LetterItemProps,
  PopoverProps,
} from "@/operations/letters/types";
import {AcceptWithConfirm, RefuseButton} from "@/operations/letters/components";
import {useRole} from "@/security/hooks";
import defaultProfilePicture from "@/assets/blank-profile-photo.png";

const STATUS_COLORS = {
  RECEIVED: {border: "green", background: "green"},
  REJECTED: {border: "#dc3545", background: "#dc3545"},
  PENDING: {border: PALETTE_COLORS.yellow, background: PALETTE_COLORS.yellow},
} as const;

const ITEMS_STYLE = {
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

export const LetterItem: FC<LetterItemProps> = ({letter}) => {
  const [isOpen, , onClose] = useToggle();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const {isManager, isAdmin} = useRole();

  const creationDate = formatDate(letter.creation_datetime!, false);
  const approvalDate = formatDate(letter.approval_datetime!, false);

  const profilePicture = letter.user?.profile_picture ?? defaultProfilePicture;
  const isDateApproved = letter.approval_datetime !== null;

  const handleItemClick = () => {
    onClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = !!anchorEl;

  const isChecked = letter.status !== "PENDING";
  const isSmall = useMediaQuery("(max-width:900px)");
  const isLarge = useMediaQuery("(min-width:1700px)");

  return (
    <>
      <Box
        sx={{
          ...ITEMS_STYLE,
          borderColor: STATUS_COLORS[letter.status!].border,
          width: isLarge ? "calc(94% / 5)" : isSmall ? "95%" : "calc(94% / 4)",
          minHeight: isLarge ? "245px" : "230px",
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
        {(isManager() || isAdmin()) && !isChecked && (
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              data-testid="more-icon-item"
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
              letterId={letter.id!}
            />
          </Box>
        )}
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "center",
            marginLeft: "2vw",
            borderBottom: "1px solid",
            paddingBottom: "2px",
            borderColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          {letter.ref}
        </Typography>
        <Box
          onClick={handleItemClick}
          sx={{
            cursor: "pointer",
            height: "95%",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              marginTop: "1rem",
              textAlign: "justify",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {letter.description}
          </Typography>
          <Box
            marginTop="0.5rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="0.6rem"
          >
            <BottomField text={creationDate} icon={<EditCalendar />} />
            {isDateApproved && (
              <BottomField text={approvalDate} icon={<EventAvailable />} />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              position: "absolute",
              bottom: "1.5rem",
            }}
          >
            <img
              src={profilePicture}
              alt="profil avatar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <Typography variant="subtitle1" fontWeight="600">
              {letter.user?.first_name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <LetterShow
        isOpen={isOpen}
        onClose={onClose}
        fileUrl={letter.file_url ?? ""}
        filename={letter.description!}
      />
    </>
  );
};

const LetterItemActions: FC<PopoverProps> = ({
  anchorEl,
  open,
  onClose,
  letterId,
}) => {
  const id = open ? "simple-popover" : undefined;

  return (
    <Box>
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
          <AcceptWithConfirm letterId={letterId} />
          <RefuseButton letterId={letterId} />
        </Box>
      </Popover>
    </Box>
  );
};

const BottomField: FC<BottomFieldProps> = ({text, icon}) => (
  <Box
    sx={{
      "display": "flex",
      "gap": "0.7rem",
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
