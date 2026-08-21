import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Paper,
  Popper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useMemo, useRef, useState} from "react";

import {EnableStatus} from "@haapi-3d601c85/typescript-client";

import {SearchUser} from "../utils/searchUtils";
import {ProfilePicture} from "./ProfilePicture";

const COLORS = {
  primary: "#6366f1",
  accent: "#8b5cf6",
  background: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  hover: "#f8fafc",
  role: {
    admin: "#f59e0b",
    manager: "#3b82f6",
    user: "#10b981",
    guest: "#8b5cf6",
  },
} as const;

const STATUS_COLORS: Record<EnableStatus, string> = {
  [EnableStatus.ENABLED]: "#10b981",
  [EnableStatus.DISABLED]: "#bf2323",
  [EnableStatus.SUSPENDED]: "#efbf44",
  [EnableStatus.ALUMNI]: "#3b82f6",
};

const STATUS_LABELS: Record<EnableStatus, string> = {
  [EnableStatus.ENABLED]: "Actif",
  [EnableStatus.DISABLED]: "Quitté",
  [EnableStatus.SUSPENDED]: "Suspendu",
  [EnableStatus.ALUMNI]: "Ancien",
};

const getStatusColor = (status?: EnableStatus) =>
  status
    ? (STATUS_COLORS[status] ?? COLORS.textSecondary)
    : COLORS.textSecondary;

const getStatusLabel = (status?: EnableStatus) =>
  status ? (STATUS_LABELS[status] ?? status) : "";

const getRoleColor = (role?: string) =>
  COLORS.role[role as keyof typeof COLORS.role] ?? COLORS.accent;

const FADE_IN = {
  hidden: {opacity: 0, y: -8},
  visible: {opacity: 1, y: 0, transition: {duration: 0.2}},
  exit: {opacity: 0, y: -4},
};

const CHIP = {hover: {scale: 1.05}, tap: {scale: 0.95}};

const SCROLL_CONTAINER_SX = {
  "maxHeight": 320,
  "overflowY": "auto",
  "overflowX": "hidden",
  "&::-webkit-scrollbar": {width: 8},
  "&::-webkit-scrollbar-thumb": {
    background: alpha(COLORS.primary, 0.25),
    borderRadius: 4,
  },
  "scrollbarWidth": "thin" as const,
};

const POPPER_BASE_SX = {zIndex: 15000};

const PAPER_SX = {
  mt: 1,
  borderRadius: 3,
  border: `1px solid ${COLORS.border}`,
  background: alpha(COLORS.background, 0.95),
  overflow: "hidden",
};

const HEADER_BOX_SX = {
  borderBottom: `1px solid ${COLORS.border}`,
};

const HEADER_ROW_SX = {mb: 1};

const ROLE_CHIPS_ROW_SX = {flexWrap: "wrap" as const, gap: 0.5};

const EMPTY_STATE_ICON_SX = {fontSize: 32, opacity: 0.5};

const PROFILE_PICTURE_SIZE = 40;

const STATUS_DOT_SX = {
  width: 7,
  height: 7,
  borderRadius: "50%",
  flexShrink: 0,
};

const ROLE_BADGE_SX = {
  px: 1,
  py: 0.25,
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 1,
};

const ACTIVE_KEY_HINT_SX = {
  fontSize: 11,
  px: 0.75,
  py: 0.25,
  borderRadius: 1,
  border: `1px solid ${alpha(COLORS.primary, 0.3)}`,
  color: COLORS.primary,
  opacity: 0.7,
  userSelect: "none" as const,
  flexShrink: 0,
};

const ROLE_CHIP_SX = {
  px: 1.5,
  py: 0.5,
  borderRadius: 1,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

const getResultItemSx = (isActive: boolean, statusColor: string) => ({
  "p": 1.5,
  "borderRadius": 1,
  "cursor": "pointer",
  "position": "relative" as const,
  "border": "1px solid",
  "borderColor": isActive ? alpha(COLORS.primary, 0.3) : "transparent",
  "background": isActive ? alpha(COLORS.primary, 0.07) : COLORS.background,
  "transition": "background 0.12s, border-color 0.12s",
  "&::before": {
    content: '""',
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: isActive ? COLORS.primary : statusColor,
    transition: "background 0.12s",
  },
  "&:hover": {
    background: alpha(COLORS.primary, 0.07),
    borderColor: alpha(COLORS.primary, 0.3),
  },
});

const getRoleBadgeSx = (roleColor: string) => ({
  ...ROLE_BADGE_SX,
  background: alpha(roleColor, 0.1),
  color: roleColor,
});

const getStatusDotSx = (statusColor: string) => ({
  ...STATUS_DOT_SX,
  background: statusColor,
});

const getRoleChipSx = (selected: boolean, color: string) => ({
  ...ROLE_CHIP_SX,
  color: selected ? "#fff" : color,
  background: selected ? color : alpha(color, 0.1),
});

const useAnchorWidth = (anchorEl?: HTMLElement | null) => {
  const [width, setWidth] = useState<number | undefined>(
    anchorEl?.getBoundingClientRect().width
  );

  useEffect(() => {
    if (!anchorEl) {
      setWidth(undefined);
      return;
    }
    const updateWidth = () => setWidth(anchorEl.getBoundingClientRect().width);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [anchorEl]);

  return width;
};
export interface SearchResultsProps {
  anchorEl?: HTMLElement | null;
  open: boolean;
  users: SearchUser[];
  isLoading: boolean;
  isFetched: boolean;
  onUserClick: (id?: string) => void;
}

const SearchResultItem = ({
  user,
  isActive,
  onClick,
  onMouseEnter,
  itemRef,
}: {
  user: SearchUser;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  itemRef: (el: HTMLDivElement | null) => void;
}) => {
  const roleColor = getRoleColor(user.role);
  const statusColor = getStatusColor(user.status);
  const statusLabel = getStatusLabel(user.status);

  return (
    <div ref={itemRef}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        sx={getResultItemSx(isActive, statusColor)}
      >
        <ProfilePicture
          src={user.profile_picture}
          firstName={user.first_name}
          lastName={user.last_name}
          size={PROFILE_PICTURE_SIZE}
        />
        <Box flex={1}>
          <Typography fontWeight={600} fontSize={14}>
            {user.first_name} {user.last_name}
          </Typography>
          <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
            <Box sx={getRoleBadgeSx(roleColor)}>{user.role}</Box>
            {user.status && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={getStatusDotSx(statusColor)} />
                <Typography fontSize={11} fontWeight={600} color={statusColor}>
                  {statusLabel}
                </Typography>
              </Stack>
            )}
            {user.ref && (
              <Typography fontSize={12} color={COLORS.textSecondary}>
                {user.ref}
              </Typography>
            )}
          </Stack>
        </Box>
        {isActive && <Box sx={ACTIVE_KEY_HINT_SX}>↵</Box>}
      </Stack>
    </div>
  );
};

export const SearchResults = ({
  anchorEl,
  open,
  users,
  isLoading,
  isFetched,
  onUserClick,
}: SearchResultsProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isKeyboardNav = useRef(false);
  const anchorWidth = useAnchorWidth(anchorEl);

  const roleCounts = useMemo(
    () =>
      users.reduce<Record<string, number>>((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {}),
    [users]
  );

  const filteredUsers = useMemo(
    () => (selectedRole ? users.filter((u) => u.role === selectedRole) : users),
    [users, selectedRole]
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredUsers]);

  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!filteredUsers.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        isKeyboardNav.current = true;
        setActiveIndex((prev) => (prev + 1) % filteredUsers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        isKeyboardNav.current = true;
        setActiveIndex((prev) =>
          prev <= 0 ? filteredUsers.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < filteredUsers.length) {
          e.preventDefault();
          onUserClick(filteredUsers[activeIndex].id);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filteredUsers, activeIndex, onUserClick]);

  if (!open || !anchorEl) return null;
  if (!isLoading && !isFetched && users.length === 0) return null;

  const isEmpty = !isLoading && isFetched && filteredUsers.length === 0;
  const popperSx = {...POPPER_BASE_SX, width: anchorWidth};

  return (
    <Popper open anchorEl={anchorEl} placement="bottom-start" sx={popperSx}>
      <AnimatePresence>
        <motion.div
          variants={FADE_IN}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Paper sx={PAPER_SX}>
            {!!users.length && (
              <Box p={1.5} sx={HEADER_BOX_SX}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={HEADER_ROW_SX}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SearchIcon fontSize="small" color="primary" />
                    <Typography fontSize={13} fontWeight={600}>
                      {filteredUsers.length} résultat
                      {filteredUsers.length > 1 && "s"}
                    </Typography>
                  </Stack>
                  <FilterListIcon fontSize="small" />
                </Stack>
                <Stack direction="row" sx={ROLE_CHIPS_ROW_SX}>
                  {Object.entries(roleCounts).map(([role, count]) => {
                    const selected = selectedRole === role;
                    const color = getRoleColor(role);
                    return (
                      <motion.div key={role} variants={CHIP}>
                        <Box
                          onClick={() =>
                            setSelectedRole(selected ? null : role)
                          }
                          sx={getRoleChipSx(selected, color)}
                        >
                          {role} ({count})
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {isLoading ? (
              <Box p={1.5} sx={SCROLL_CONTAINER_SX}>
                <Stack alignItems="center" py={4}>
                  <CircularProgress size={24} />
                </Stack>
              </Box>
            ) : isEmpty ? (
              <Box p={1.5} sx={SCROLL_CONTAINER_SX}>
                <Stack alignItems="center" py={4}>
                  <SearchIcon sx={EMPTY_STATE_ICON_SX} />
                  <Typography fontSize={14} color="text.secondary">
                    Aucun résultat
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Box p={1.5} sx={SCROLL_CONTAINER_SX}>
                <Stack spacing={0.75}>
                  {filteredUsers.map((user, index) => (
                    <SearchResultItem
                      key={user.id}
                      user={user}
                      isActive={index === activeIndex}
                      onClick={() => onUserClick(user.id)}
                      onMouseEnter={() => {
                        if (!isKeyboardNav.current) {
                          setActiveIndex(index);
                        }
                      }}
                      itemRef={(el) => {
                        itemRefs.current[index] = el;
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Popper>
  );
};
