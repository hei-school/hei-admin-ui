import {useRole} from "@/security/hooks";
import {ResponsiveGrid} from "@/ui/components";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {Announcement, Scope} from "@haapi/typescript-client";
import {
  Newspaper as AnnouncementIcon,
  FilterList,
  People,
  Public,
  School,
  Work,
} from "@mui/icons-material";
import {Box, Chip, LinearProgress, Paper, Tooltip} from "@mui/material";
import {FC, useState} from "react";
import {List, useListContext, useListFilterContext} from "react-admin";
import {AnnouncementFilter} from "./components";
import {AnnouncementCard} from "./components/AnnoucementCard";
import {ANNOUNCEMENT_SCOPE} from "./utils/constants/announcementsScopes";

const AnnouncementsGrid = () => {
  const {data: announcements = [], isLoading} = useListContext();

  return (
    <ResponsiveGrid gap="1.5rem">
      {announcements.map((announcement: Announcement) => (
        <AnnouncementCard
          key={announcement.id}
          id={announcement.id!}
          scope={announcement.scope!}
          author={announcement.author!}
          creation_datetime={announcement.creation_datetime!}
          isLoading={isLoading}
          title={announcement.title!}
        />
      ))}
    </ResponsiveGrid>
  );
};

const ScopeFilterChips = () => {
  const {filterValues, setFilters} = useListFilterContext();
  const [activeScope, setActiveScope] = useState<string | null>(null);
  const {isStudent, isTeacher, isManager, isAdmin} = useRole();

  const handleScopeFilter = (scope: string | null) => {
    setActiveScope(scope);
    if (scope) {
      setFilters({...filterValues, scope}, null, false);
    } else {
      const {scope, ...restFilters} = filterValues ?? {};
      setFilters(restFilters, null, false);
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case Scope.GLOBAL:
        return <Public sx={{fontSize: "1.2rem"}} />;
      case Scope.STUDENT:
        return <School sx={{fontSize: "1.2rem"}} />;
      case Scope.TEACHER:
        return <Work sx={{fontSize: "1.2rem"}} />;
      case Scope.MANAGER:
        return <People sx={{fontSize: "1.2rem"}} />;
      default:
        return <FilterList sx={{fontSize: "1.2rem"}} />;
    }
  };

  const getChipStyles = (isActive: boolean) => ({
    "fontWeight": "bold",
    "fontSize": "0.9rem",
    "height": "36px",
    "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "background": isActive
      ? "linear-gradient(45deg, #1976d2, #42a5f5)"
      : "white",
    "border": isActive ? "none" : "1px solid #e0e0e0",
    "color": isActive ? "white" : "#666",
    "& .MuiChip-icon": {
      color: isActive ? "white" : "#666",
      transition: "color 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      background: isActive
        ? "linear-gradient(45deg, #1976d2, #42a5f5)"
        : "linear-gradient(45deg, #f5f5f5, #ffffff)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
  });

  const getFilteredScopes = () => {
    if (isAdmin() || isManager()) {
      return Object.entries(ANNOUNCEMENT_SCOPE);
    }
    if (isStudent()) {
      return Object.entries(ANNOUNCEMENT_SCOPE).filter(
        ([scope]) => scope === Scope.GLOBAL || scope === Scope.STUDENT
      );
    }
    if (isTeacher()) {
      return Object.entries(ANNOUNCEMENT_SCOPE).filter(
        ([scope]) => scope === Scope.GLOBAL || scope === Scope.TEACHER
      );
    }
    return [];
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        padding: "20px",
        background: "linear-gradient(to right, #f8f9fa, #ffffff)",
        borderRadius: "16px",
        marginBottom: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
      }}
    >
      <Tooltip title="Tous les types d'annonces" arrow>
        <Chip
          icon={<FilterList sx={{fontSize: "1.2rem"}} />}
          label="Tous"
          clickable
          onClick={() => handleScopeFilter(null)}
          sx={getChipStyles(activeScope === null)}
        />
      </Tooltip>

      {getFilteredScopes().map(([scope, label]) => (
        <Tooltip key={scope} title={label as string} arrow>
          <Chip
            icon={getScopeIcon(scope)}
            label={label as string}
            clickable
            onClick={() => handleScopeFilter(scope)}
            sx={getChipStyles(activeScope === scope)}
          />
        </Tooltip>
      ))}
    </Paper>
  );
};

const AnnouncementActions = () => {
  return (
    <Box>
      <CreateButton resource="announcements" />
      <AnnouncementFilter />
    </Box>
  );
};

export const AnnouncementList = () => {
  const {isManager, isAdmin} = useRole();

  return (
    <List
      actions={false}
      pagination={<PrevNextPagination />}
      resource="announcements"
      perPage={12}
      empty={false}
      sx={{
        "& .RaList-content": {
          backgroundColor: "none",
          boxShadow: "none",
        },
        "mt": 2,
      }}
    >
      <AnnouncementLoader />
      <HaListTitle
        actions={(isManager() || isAdmin()) && <AnnouncementActions />}
        filterIndicator={true}
        title="Liste des annonces"
        icon={<AnnouncementIcon />}
        mainSearch={{source: "", label: ""}}
      />
      <ScopeFilterChips />
      <AnnouncementsGrid />
    </List>
  );
};

const AnnouncementLoader: FC = () => {
  const {isLoading} = useListContext();
  return isLoading && <LinearProgress />;
};
