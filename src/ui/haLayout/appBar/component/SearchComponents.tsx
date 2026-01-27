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

// Couleurs modernes
const COLORS = {
  primary: "#6366f1",
  accent: "#8b5cf6",
  background: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  hover: "#f8fafc",
  backdrop: "rgba(15, 23, 42, 0.5)",
  roleColors: {
    admin: "#f59e0b",
    manager: "#3b82f6",
    user: "#10b981",
    guest: "#8b5cf6",
  },
};

// Animations Framer Motion - Types corrigés
const fadeIn = {
  hidden: {opacity: 0, y: -10},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.2},
  },
  exit: {opacity: 0, y: -5},
};

const itemVariants = {
  hidden: {opacity: 0, x: -20},
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    scale: 1.02,
    x: 5,
    transition: {duration: 0.2},
  },
};

const chipVariants = {
  initial: {scale: 1},
  hover: {scale: 1.05},
  tap: {scale: 0.95},
  selected: {
    scale: 1.1,
  },
};

export const SearchResultItem = ({
  user,
  onClick,
  index,
}: {
  user: SearchUser;
  onClick: () => void;
  index: number;
}) => {
  const roleColor =
    COLORS.roleColors[user.role as keyof typeof COLORS.roleColors] ||
    COLORS.accent;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        onClick={onClick}
        sx={{
          "p": 1.5,
          "borderRadius": 2,
          "cursor": "pointer",
          "background": "white",
          "border": "1px solid transparent",
          "position": "relative",
          "overflow": "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: roleColor,
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
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                background: alpha(roleColor, 0.1),
                color: roleColor,
                fontSize: 11,
                fontWeight: 600,
                display: "inline-block",
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

export const SearchResults = ({
  anchorEl,
  open,
  users,
  isLoading,
  isFetched,
  onUserClick,
}: {
  anchorEl?: HTMLElement | null;
  open: boolean;
  users: SearchUser[];
  isLoading: boolean;
  isFetched: boolean;
  onUserClick: (id?: string) => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const canOpen = Boolean(open && anchorEl);
  const popperWidth = useMemo(
    () => anchorEl?.getBoundingClientRect().width,
    [anchorEl]
  );

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((user) => {
      counts[user.role] = (counts[user.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return selectedRole
      ? users.filter((user) => user.role === selectedRole)
      : users;
  }, [users, selectedRole]);

  const showNoResults = !isLoading && isFetched && filteredUsers.length === 0;

  if (!canOpen) return null;

  // Extracted ternary for justifyContent
  const getContentJustification = () => {
    if (isLoading || showNoResults) return "center";
    return "flex-start";
  };

  return (
    <Popper
      open
      anchorEl={anchorEl}
      placement="bottom-start"
      disablePortal
      sx={{
        zIndex: 15000,
        width: popperWidth,
        filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxHeight: 400,
              overflow: "hidden",
              border: `1px solid ${COLORS.border}`,
              background: COLORS.background,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            {/* Header avec filtres */}
            {users.length > 0 && (
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: `1px solid ${COLORS.border}`,
                  background: "rgba(248, 250, 252, 0.5)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SearchIcon sx={{fontSize: 16, color: COLORS.primary}} />
                    <Typography
                      fontSize={13}
                      fontWeight={600}
                      color={COLORS.text}
                    >
                      {users.length} résultat{users.length > 1 ? "s" : ""}
                    </Typography>
                  </Stack>
                  <FilterListIcon
                    sx={{fontSize: 16, color: COLORS.textSecondary}}
                  />
                </Stack>

                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                  <motion.div
                    variants={chipVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    animate={selectedRole === null ? "selected" : "initial"}
                  >
                    <Box
                      onClick={() => setSelectedRole(null)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        background:
                          selectedRole === null
                            ? COLORS.primary
                            : alpha(COLORS.primary, 0.1),
                        color: selectedRole === null ? "white" : COLORS.primary,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-block",
                        transition: "all 0.2s",
                        border:
                          selectedRole === null
                            ? `2px solid ${COLORS.primary}`
                            : "none",
                      }}
                    >
                      Tous ({users.length})
                    </Box>
                  </motion.div>

                  {Object.entries(roleCounts).map(([role, count]) => {
                    const roleColor =
                      COLORS.roleColors[
                        role as keyof typeof COLORS.roleColors
                      ] || COLORS.accent;
                    return (
                      <motion.div
                        key={role}
                        variants={chipVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={selectedRole === role ? "selected" : "initial"}
                      >
                        <Box
                          onClick={() => setSelectedRole(role)}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            background:
                              selectedRole === role
                                ? roleColor
                                : alpha(roleColor, 0.1),
                            color: selectedRole === role ? "white" : roleColor,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-block",
                            transition: "all 0.2s",
                            border:
                              selectedRole === role
                                ? `2px solid ${roleColor}`
                                : "none",
                          }}
                        >
                          {role} ({count})
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Contenu */}
            <Box
              sx={{
                maxHeight: 320,
                overflow: "auto",
                p: 1.5,
                justifyContent: getContentJustification(),
              }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                  >
                    <Stack alignItems="center" py={4}>
                      <CircularProgress
                        size={24}
                        sx={{
                          color: COLORS.primary,
                        }}
                      />
                    </Stack>
                  </motion.div>
                ) : showNoResults ? (
                  <motion.div
                    key="empty"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                  >
                    <Stack alignItems="center" py={4} spacing={1}>
                      <SearchIcon
                        sx={{
                          fontSize: 32,
                          color: alpha(COLORS.textSecondary, 0.5),
                        }}
                      />
                      <Typography fontSize={14} color={COLORS.textSecondary}>
                        Aucun résultat trouvé
                      </Typography>
                    </Stack>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                  >
                    <Stack spacing={0.75}>
                      {filteredUsers.map((user, index) => (
                        <SearchResultItem
                          key={user.id}
                          user={user}
                          onClick={() => onUserClick(user.id)}
                          index={index}
                        />
                      ))}
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Popper>
  );
};
