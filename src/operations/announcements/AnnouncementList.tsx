import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {ResponsiveGrid} from "@/ui/components";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {Announcement, Scope} from "@haapi/typescript-client";
import {
  Newspaper as AnnouncementIcon,
  Campaign,
  FilterList,
  People,
  Public,
  School,
  Work,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Chip,
  LinearProgress,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {FC, useState} from "react";
import {Link, List, useListContext, useListFilterContext} from "react-admin";
import {AnnouncementFilter} from "./components";
import {EmailField} from "./components/EmailField";
import {ANNOUNCEMENT_SCOPE} from "./utils/constants/announcementsScopes";
import {getBgImg} from "./utils/getBgImg";

const cardStyle: React.CSSProperties = {
  minWidth: "300px",
  borderRadius: "7px",
  boxShadow: "0 0 10px rgb(182, 182, 182)",
  borderBottom: "10px solid",
  position: "relative",
  overflow: "visible",
  marginTop: "50px",
};

export const getChipColor = (scope: string) => {
  switch (scope) {
    case Scope.GLOBAL:
      return PALETTE_COLORS.primary;
    case Scope.STUDENT:
    case Scope.TEACHER:
    case Scope.MANAGER:
      return PALETTE_COLORS.yellow;
    default:
      return PALETTE_COLORS.yellow;
  }
};

const AnnouncementsGrid = () => {
  const {data: announcements = [], isLoading} = useListContext();

  return (
    <ResponsiveGrid gap="1.5rem">
      {announcements.map((announcement: Announcement) => (
        <Link
          key={announcement.id}
          to={`/announcements/${announcement.id}/show`}
          sx={{
            ...cardStyle,
            "borderColor": getChipColor(announcement?.scope!),
            "&:hover": {transform: "scale(1.05)"},
            "maxWidth": "100%",
            "width": "100%",
            "boxSizing": "border-box",
            "marginBottom": "1rem",
          }}
        >
          <Card component="div">
            {isLoading ? (
              <Skeleton variant="rectangular" width={100} height={100} />
            ) : (
              <CardMedia
                component="img"
                image={getBgImg(announcement?.scope!)}
                alt="Announcement Background"
                sx={{
                  borderRadius: "50%",
                  height: "100px",
                  width: "100px",
                  marginLeft: "1.5rem",
                  position: "absolute",
                  top: "-45px",
                  border: "4px solid",
                  borderColor: getChipColor(announcement?.scope!),
                }}
              />
            )}
            <Box
              sx={{
                backgroundColor: getChipColor(announcement?.scope!),
                height: "60px",
                padding: "1rem",
                borderRadius: "7px 7px 0 0",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                noWrap
                textOverflow="ellipsis"
                padding="1rem"
              >
                {announcement.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "1rem",
                  position: "relative",
                }}
              >
                <Campaign
                  sx={{
                    color: getChipColor(announcement?.scope!),
                    fontSize: "2.5rem",
                    position: "absolute",
                    top: 0,
                    transform: "rotate(-10deg)",
                  }}
                />
                <Typography sx={{textIndent: "2.5rem"}}>
                  Cliquez sur la carte pour accéder à l'annonce complète et
                  découvrir tous les détails pertinents.
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginInline="1rem"
                paddingBlock="1rem"
                borderTop="1px solid rgba(100, 100, 100, 0.3)"
              >
                <Box>
                  <EmailField value={announcement.author?.email} />
                  <Typography>
                    {new Date(
                      announcement?.creation_datetime!
                    ).toLocaleString()}
                  </Typography>
                </Box>
                {isLoading ? (
                  <Skeleton variant="circular" width={50} height={50} />
                ) : (
                  <Avatar
                    alt={announcement.author?.first_name}
                    src={announcement.author?.profile_picture}
                    sx={{
                      height: 50,
                      width: 50,
                      border: "2px solid",
                      borderColor: getChipColor(announcement?.scope!),
                    }}
                  />
                )}
              </Box>
            </Box>
          </Card>
        </Link>
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
      const {scope, ...restFilters} = filterValues || {};
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
