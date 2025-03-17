import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {Announcement, Scope} from "@haapi/typescript-client";
import {Newspaper as AnnouncementIcon, Campaign} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, {FC} from "react";
import {Link, List, useListContext} from "react-admin";
import {AnnouncementFilter} from "./components";
import {EmailField} from "./components/EmailField";
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
  const {data: announcements = []} = useListContext();
  const isSmall = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");
  const isMedium = useMediaQuery("(min-width:901px) and (max-width:1400px)");
  const isDesktop = useMediaQuery("(min-width:1400px)");

  const getGridTemplateColumns = () => {
    if (isSmall) return "1fr";
    if (isTablet) return "1fr 1fr";
    if (isMedium) return "1fr 1fr 1fr";
    if (isDesktop) return "1fr 1fr 1fr 1fr";
    return "1fr";
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={getGridTemplateColumns()}
      gap="1.5rem"
      padding="1.5rem"
      sx={{
        justifyItems: announcements.length <= 2 ? "start" : "center",
        paddingLeft: "2rem",
      }}
    >
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
          }}
        >
          <Card component="div">
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
              </Box>
            </Box>
          </Card>
        </Link>
      ))}
    </Box>
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
      <AnnouncementsGrid />
    </List>
  );
};

const AnnouncementLoader: FC = () => {
  const {isLoading} = useListContext();
  return isLoading && <LinearProgress />;
};
