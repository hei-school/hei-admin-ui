import {Search} from "@mui/icons-material";
import {Box, CircularProgress, InputBase} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useGlobalSearch} from "./component";
import {
  COLORS,
  SX_ACTIVE_CONTAINER,
  SX_ACTIVE_INPUT_WRAPPER,
  SX_BACKDROP,
  SX_INPUT,
  SX_SEARCH_TRIGGER,
  SX_SEARCH_TRIGGER_PLACEHOLDER,
} from "./component/SearchBarStyles";
import {SearchResults as SearchResultsComponent} from "./component/SearchComponents";
import {SearchUser} from "./utils/searchUtils";

const isMacOS = (): boolean => {
  if (typeof navigator === "undefined") return false;

  if ("userAgentData" in navigator) {
    const uaData = (navigator as any).userAgentData;
    if (uaData && typeof uaData.platform === "string") {
      return uaData.platform === "macOS";
    }
  }

  return /Mac/i.test(navigator.userAgent);
};

const isMac = isMacOS();
const shortcutLabel = isMac ? "⌘ K" : "Ctrl + K";

type BackdropProps = {
  open: boolean;
  onClose: () => void;
};

const SearchBackdrop = ({open, onClose}: BackdropProps) => (
  <AnimatePresence>
    {open && (
      <Box
        component={motion.div}
        initial={{opacity: 0}}
        animate={{opacity: 1, backdropFilter: "blur(8px)"}}
        exit={{opacity: 0}}
        onClick={onClose}
        sx={SX_BACKDROP}
      />
    )}
  </AnimatePresence>
);

type SearchTriggerProps = {
  onClick: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
};

const SearchTrigger = ({onClick, searchRef}: SearchTriggerProps) => (
  <Box
    ref={searchRef}
    onClick={onClick}
    sx={{
      ...SX_SEARCH_TRIGGER,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box display="flex" alignItems="center">
      <Search sx={{color: COLORS.primary, mr: 1}} />
      <Box sx={SX_SEARCH_TRIGGER_PLACEHOLDER}>Rechercher…</Box>
    </Box>

    <Box
      sx={{
        fontSize: 12,
        px: 0.75,
        py: 0.25,
        borderRadius: 1,
        border: `1px solid ${COLORS.primary}40`,
        color: COLORS.primary,
        opacity: 0.6,
        userSelect: "none",
      }}
    >
      {shortcutLabel}
    </Box>
  </Box>
);

type ActiveSearchContainerProps = {
  origin: {x: number; y: number};
  inputRef: React.RefObject<HTMLInputElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  children: React.ReactNode;
};

const ActiveSearchContainer = ({
  origin,
  inputRef,
  wrapperRef,
  value,
  onChange,
  isLoading,
  children,
}: ActiveSearchContainerProps) => (
  <Box
    component={motion.div}
    initial={{
      x: origin.x - window.innerWidth / 2,
      y: origin.y - window.innerHeight / 2,
      opacity: 0,
    }}
    animate={{x: 0, y: 0, opacity: 1}}
    exit={{
      x: origin.x - window.innerWidth / 2,
      y: origin.y - window.innerHeight / 2,
      opacity: 0,
    }}
    transition={{type: "spring", stiffness: 220, damping: 26}}
    sx={SX_ACTIVE_CONTAINER}
  >
    <Box ref={wrapperRef} sx={SX_ACTIVE_INPUT_WRAPPER}>
      <Search sx={{color: COLORS.primary, mr: 2}} />
      <InputBase
        inputRef={inputRef}
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un utilisateur..."
        sx={SX_INPUT}
      />
      {isLoading && <CircularProgress size={22} />}
    </Box>
    {children}
  </Box>
);

const SearchResults = React.memo(SearchResultsComponent);

const USER_ROUTES: Record<string, (id?: string) => string> = {
  STUDENT: (id) => `/students/${id}/show`,
  TEACHER: (id) => `/teachers/${id}/show`,
  ORGANIZER: (id) => `/organisers/${id}/show`,
  MONITOR: (id) => `/monitors/${id}/show`,
  STAFF: (id) => `/staffmembers/${id}/show`,
};

const GlobalSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [origin, setOrigin] = useState({x: 0, y: 0});
  const [debouncedValue, setDebouncedValue] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const {searchValue, setSearchValue, users, isLoading, isFetched} =
    useGlobalSearch();

  const isActive = isFocused;
  const isResultsOpen = isActive && debouncedValue.trim().length > 0;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(searchValue), 300);
    return () => clearTimeout(t);
  }, [searchValue]);

  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users]
  );

  const getUserNavigationPath = (user: SearchUser) =>
    USER_ROUTES[user.role]?.(user.id) ?? "#";

  const captureOrigin = () => {
    if (!searchRef.current) return;
    const rect = searchRef.current.getBoundingClientRect();
    setOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  const handleFocus = () => {
    captureOrigin();
    setIsFocused(true);
    setTimeout(() => inputRef.current?.focus(), 20);
  };

  const handleClose = () => {
    setSearchValue("");
    setDebouncedValue("");
    setIsFocused(false);
  };

  const handleUserClick = (userId?: string) => {
    if (!userId) return;

    const user = usersById.get(userId);
    if (!user) return;

    const path = getUserNavigationPath(user);
    if (path !== "#") {
      navigate(path);
      handleClose();
    }
  };

  useEffect(() => {
    const onShortcut = (e: KeyboardEvent) => {
      const isShortcutKey = isMac ? e.metaKey : e.ctrlKey;

      if (isShortcutKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!isActive) handleFocus();
      }

      if (e.key === "Escape" && isActive) {
        handleClose();
      }
    };

    document.addEventListener("keydown", onShortcut);
    return () => document.removeEventListener("keydown", onShortcut);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const onClickOutside = (e: MouseEvent) => {
      if (
        activeInputRef.current &&
        !activeInputRef.current.contains(e.target as Node) &&
        !debouncedValue.trim()
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isActive, debouncedValue]);

  return (
    <>
      <SearchBackdrop open={isActive} onClose={handleClose} />

      {!isActive && (
        <SearchTrigger onClick={handleFocus} searchRef={searchRef} />
      )}

      <AnimatePresence>
        {isActive && (
          <ActiveSearchContainer
            origin={origin}
            inputRef={inputRef}
            wrapperRef={activeInputRef}
            value={searchValue}
            onChange={setSearchValue}
            isLoading={isLoading}
          >
            {isResultsOpen && (
              <SearchResults
                anchorEl={activeInputRef.current}
                open
                users={users}
                isLoading={isLoading}
                isFetched={isFetched}
                onUserClick={handleUserClick}
              />
            )}
          </ActiveSearchContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
