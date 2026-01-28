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
import {useMemo, useState} from "react";

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

const fadeIn = {
  hidden: {opacity: 0, y: -8},
  visible: {opacity: 1, y: 0, transition: {duration: 0.2}},
  exit: {opacity: 0, y: -4},
};

const listItem = {
  hidden: {opacity: 0, x: -16},
  visible: {opacity: 1, x: 0},
  hover: {scale: 1.02, x: 4},
};

const chip = {
  hover: {scale: 1.05},
  tap: {scale: 0.95},
  selected: {scale: 1.1},
};

const scrollbarStyles = {
  "&::-webkit-scrollbar": {width: 8},
  "&::-webkit-scrollbar-thumb": {
    background: alpha(COLORS.primary, 0.25),
    borderRadius: 4,
  },
  "scrollbarWidth": "thin" as const,
};

const getRoleColor = (role?: string): string =>
  COLORS.role[role as keyof typeof COLORS.role] ?? COLORS.accent;

interface SearchResultItemProps {
  user: SearchUser;
  index: number;
  onClick: () => void;
}

const SearchResultItem = ({user, index, onClick}: SearchResultItemProps) => {
  const roleColor = getRoleColor(user.role);

  return (
    <motion.div
      variants={listItem}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{delay: index * 0.05}}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        onClick={onClick}
        sx={{
          "p": 1.5,
          "borderRadius": 1,
          "cursor": "pointer",
          "position": "relative",
          "border": "1px solid transparent",
          "background": COLORS.background,
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: roleColor,
          },
          "&:hover": {
            background: COLORS.hover,
            borderColor: COLORS.border,
          },
        }}
      >
        <ProfilePicture
          src={user.profile_picture}
          firstName={user.first_name}
          lastName={user.last_name}
          size={40}
        />

        <Box flex={1}>
          <Typography fontWeight={600} fontSize={14}>
            {user.first_name} {user.last_name}
          </Typography>

          <Stack direction="row" spacing={1} mt={0.5}>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 1,
                background: alpha(roleColor, 0.1),
                color: roleColor,
              }}
            >
              {user.role}
            </Box>

            {user.ref && (
              <Typography fontSize={12} color={COLORS.textSecondary}>
                {user.ref}
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </motion.div>
  );
};

interface SearchResultsProps {
  anchorEl?: HTMLElement | null;
  open: boolean;
  users: SearchUser[];
  isLoading: boolean;
  isFetched: boolean;
  onUserClick: (id?: string) => void;
}

export const SearchResults = ({
  anchorEl,
  open,
  users,
  isLoading,
  isFetched,
  onUserClick,
}: SearchResultsProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const canOpen = Boolean(open && anchorEl);
  const width = anchorEl?.getBoundingClientRect().width;

  const roleCounts = useMemo<Record<string, number>>(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    return selectedRole ? users.filter((u) => u.role === selectedRole) : users;
  }, [users, selectedRole]);

  const isEmpty = !isLoading && isFetched && filteredUsers.length === 0;

  if (!canOpen) return null;

  return (
    <Popper
      open
      anchorEl={anchorEl}
      placement="bottom-start"
      sx={{zIndex: 15000, width}}
    >
      <AnimatePresence>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Paper
            sx={{
              borderRadius: 1,
              border: `1px solid ${COLORS.border}`,
              background: alpha(COLORS.background, 0.95),
              overflow: "hidden",
            }}
          >
            {!!users.length && (
              <Box p={1.5} borderBottom={`1px solid ${COLORS.border}`}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SearchIcon fontSize="small" color="primary" />
                    <Typography fontSize={13} fontWeight={600}>
                      {users.length} résultat
                      {users.length > 1 && "s"}
                    </Typography>
                  </Stack>
                  <FilterListIcon fontSize="small" />
                </Stack>

                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                  {Object.entries(roleCounts).map(
                    ([role, count]: [string, number]) => {
                      const selected = selectedRole === role;
                      const color = getRoleColor(role);

                      return (
                        <motion.div
                          key={role}
                          variants={chip}
                          animate={selected ? "selected" : undefined}
                        >
                          <Box
                            onClick={() => setSelectedRole(role)}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 600,
                              color: selected ? "#fff" : color,
                              background: selected ? color : alpha(color, 0.1),
                            }}
                          >
                            {role} ({count})
                          </Box>
                        </motion.div>
                      );
                    }
                  )}
                </Stack>
              </Box>
            )}

            <Box maxHeight={320} overflow="auto" p={1.5} sx={scrollbarStyles}>
              {isLoading && (
                <Stack alignItems="center" py={4}>
                  <CircularProgress size={24} />
                </Stack>
              )}

              {isEmpty && (
                <Stack alignItems="center" py={4}>
                  <SearchIcon sx={{fontSize: 32, opacity: 0.5}} />
                  <Typography fontSize={14} color="text.secondary">
                    Aucun résultat
                  </Typography>
                </Stack>
              )}

              {!isLoading && !isEmpty && (
                <Stack spacing={0.75}>
                  {filteredUsers.map((user, index) => (
                    <SearchResultItem
                      key={user.id}
                      user={user}
                      index={index}
                      onClick={() => onUserClick(user.id)}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Popper>
  );
};
