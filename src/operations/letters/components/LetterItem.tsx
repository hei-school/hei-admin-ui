import {
  AccessTimeOutlined,
  CheckCircle,
  DescriptionOutlined,
  EventAvailable,
  MoreVert,
  PersonOutline,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import React, {FC, useState} from "react";

import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {AcceptWithConfirm, RefuseButton} from "@/operations/letters/components";
import LetterShow from "@/operations/letters/LetterShow";
import {
  BottomFieldProps,
  LetterItemProps,
  PopoverProps,
} from "@/operations/letters/types";
import {useRole} from "@/security/hooks";
import {formatDate} from "@/utils/date";

const STATUS_COLORS = {
  RECEIVED: {
    main: "#4caf50",
    light: "rgba(76, 175, 80, 0.1)",
    gradient: "linear-gradient(135deg, #4caf50, #2e7d32)",
    name: "Accepté",
  },
  REJECTED: {
    main: "#f44336",
    light: "rgba(244, 67, 54, 0.08)",
    gradient: "linear-gradient(135deg, #f44336, #d32f2f)",
    name: "Rejeté",
  },
  PENDING: {
    main: PALETTE_COLORS.yellow,
    light: "rgba(255, 193, 7, 0.08)",
    gradient: "linear-gradient(135deg, #ffc107, #ff8f00)",
    name: "En attente",
  },
} as const;

export const LetterItem: FC<LetterItemProps> = ({
  letter,
  onSelect,
  selected = false,
  showCheckbox = false,
}) => {
  const [isOpen, , onClose] = useToggle();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);

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
  const isLarge = useMediaQuery("(min-width:1700px)");

  const statusColor = STATUS_COLORS[letter.status!];

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: isLarge ? "290px" : "270px",
          minHeight: "300px",
          marginBottom: "20px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Paper
          className="card-back"
          sx={{
            position: "absolute",
            width: "96%",
            height: "94%",
            top: "6%",
            left: "2%",
            borderRadius: "20px",
            background: "#f5f5f5",
            zIndex: 2,
            transition: "all 0.3s ease",
            transform: isHovered
              ? "translateY(4px) scale(0.97)"
              : "translateY(3px) scale(0.98)",
          }}
        />

        <Paper
          className="card-main"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            background: "white",
            boxShadow: isHovered
              ? "0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)"
              : "0 10px 20px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)",
            zIndex: 3,
            transition: "all 0.3s ease",
            transform: isHovered ? "translateY(-8px)" : "translateY(0)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "6px",
              background: statusColor.main,
              zIndex: 10,
            }}
          />
          <Box
            sx={{
              "display": "flex",
              "alignItems": "center",
              "justifyContent": "space-between",
              "padding": "20px 20px 15px 20px",
              "position": "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "5%",
                width: "90%",
                height: "1px",
                border: "1px solid rgba(0,0,0,0.05)",
                background: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <Box
                sx={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: statusColor.main,
                  position: "relative",
                  border: `1px solid ${alpha(statusColor.main, 0.2)}`,
                  boxShadow: `0 4px 8px ${alpha(statusColor.main, 0.1)}`,
                  transition: "transform 0.3s ease",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
              >
                {showCheckbox && (
                  <Checkbox
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<CheckCircle sx={{color: "#4caf50"}} />}
                    checked={selected}
                    onChange={(e) =>
                      onSelect && onSelect(letter.id!, e.target.checked)
                    }
                    sx={{
                      "position": "absolute",
                      "top": "-8px",
                      "left": "-8px",
                      "zIndex": 2,
                      "opacity": selected || isHovered ? 1 : 0,
                      "transition": "opacity 0.3s ease",
                      "backgroundColor": "white",
                      "borderRadius": "50%",
                      "padding": "2px",
                      "boxShadow": "0 3px 8px rgba(0,0,0,0.12)",
                      "transform": selected ? "scale(1.1)" : "scale(1)",
                      "&:hover": {
                        opacity: 1,
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: "16px",
                      },
                    }}
                    className="letter-checkbox"
                    data-testid={`letter-checkbox-${letter.id}`}
                  />
                )}

                <DescriptionOutlined
                  sx={{
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: statusColor.main,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: statusColor.main,
                    }}
                  />
                  {statusColor.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "#37474f",
                    whiteSpace: "nowrap",
                  }}
                >
                  {letter.ref}
                </Typography>
              </Box>
            </Box>

            {(isManager() || isAdmin()) && !isChecked && (
              <Box>
                <Tooltip title="Options">
                  <IconButton
                    id="letter-option"
                    sx={{
                      "padding": "8px",
                      "background": "rgba(0,0,0,0.03)",
                      "transition": "background-color 0.2s ease",
                      "&:hover": {
                        background: "rgba(0,0,0,0.08)",
                      },
                    }}
                    onClick={handleClick}
                  >
                    <MoreVert
                      sx={{
                        fontSize: "1.2rem",
                        color: "#546e7a",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <LetterItemActions
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  open={open}
                  letterId={letter.id!}
                />
              </Box>
            )}
          </Box>

          <Box
            onClick={handleItemClick}
            sx={{
              "cursor": "pointer",
              "padding": "15px 20px",
              "display": "flex",
              "flexDirection": "column",
              "flex": 1,
              "justifyContent": "space-between",
              "transition": "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.01)",
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "#546e7a",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.6",
                  marginBottom: "16px",
                  minHeight: "4.2rem",
                  fontWeight: "400",
                  letterSpacing: "0.2px",
                }}
              >
                {letter.description}
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  "display": "flex",
                  "flexDirection": "column",
                  "gap": "8px",
                  "marginBottom": "16px",
                  "position": "relative",
                  "paddingLeft": "16px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: "3px",
                    top: "6px",
                    bottom: isDateApproved ? "6px" : "50%",
                    width: "2px",
                    background: isDateApproved
                      ? `linear-gradient(to bottom, ${statusColor.main}, #78909c)`
                      : statusColor.main,
                    borderRadius: "4px",
                  },
                }}
              >
                <TimelineItem
                  text={`Créé le ${creationDate}`}
                  icon={<AccessTimeOutlined />}
                  color={statusColor.main}
                />
                {isDateApproved && (
                  <TimelineItem
                    text={`Approuvé le ${approvalDate}`}
                    icon={<EventAvailable />}
                    color="#78909c"
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.7), rgba(240,240,240,0.7))",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    border: "2px solid white",
                  }}
                >
                  <img
                    src={profilePicture}
                    alt="profil avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "600",
                      color: "#455a64",
                      fontSize: "0.85rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {letter.user?.first_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#78909c",
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <PersonOutline sx={{fontSize: "0.8rem"}} />
                    Expéditeur
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <LetterShow
        isOpen={isOpen}
        onClose={onClose}
        fileUrl={letter.file_url ?? ""}
        filename={letter.description!}
      />
    </Box>
  );
};

const TimelineItem: FC<BottomFieldProps & {color: string}> = ({
  text,
  icon,
  color,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: color,
          position: "absolute",
          left: "-20px",
          boxShadow: `0 0 0 3px ${alpha(color, 0.2)}`,
        }}
      />
      <Box
        sx={{
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "color": color,
          "& svg": {
            fontSize: "0.9rem",
          },
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.8rem",
          color: "#546e7a",
          fontWeight: "500",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const LetterItemActions: FC<PopoverProps> = ({
  anchorEl,
  open,
  onClose,
  letterId,
}) => {
  const id = open ? `letter-actions-${letterId}` : undefined;

  return (
    <Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            "borderRadius": "16px",
            "boxShadow":
              "0 15px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.08)",
            "overflow": "hidden",
            "animation": "popoverFadeIn 0.3s ease",
            "@keyframes popoverFadeIn": {
              from: {opacity: 0, transform: "translateY(-10px)"},
              to: {opacity: 1, transform: "translateY(0)"},
            },
          },
        }}
      >
        <Box
          sx={{
            width: "200px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
          }}
        >
          <AcceptWithConfirm letterId={letterId} />
          <RefuseButton letterId={letterId} />
        </Box>
      </Popover>
    </Box>
  );
};
