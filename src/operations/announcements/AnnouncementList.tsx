import React from "react";

import {List, useListContext} from "react-admin";
import {Announcement, Scope} from "@haapi/typescript-client";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import {Newspaper as AnnouncementIcon} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {PALETTE_COLORS} from "@/haTheme";
import {HaListTitle} from "@/ui/haList";
import {CreateButton} from "@/ui/haToolbar";
import {useRole} from "@/security/hooks";
import {AnnouncementFilter} from "./components";
import {ANNOUNCEMENT_SCOPE} from "./utils/constants/announcementsScopes";
import {PrevNextPagination} from "../utils";
import {EmailField} from "./components/EmailField";
import {getBgImg} from "./utils/getBgImg";
import {useMediaQuery} from "@mui/material";

const cardStyle: React.CSSProperties = {
  width: 350,
  height: "fit-content",
  display: "inline-block",
  verticalAlign: "top",
  borderRadius: "7px",
  boxShadow:
    "rgba(0, 0, 0, 0.24) 0px 3px 8pxrgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
  borderBottom: "8px solid",
  borderColor: PALETTE_COLORS.yellow,
  position: "relative",
};

const getChipColor = (scope: string) => {
  switch (scope) {
    case Scope.GLOBAL:
      return PALETTE_COLORS.red;
    case Scope.STUDENT:
      return PALETTE_COLORS.yellow;
    case Scope.TEACHER:
      return PALETTE_COLORS.primary;
    case Scope.MANAGER:
      return PALETTE_COLORS.black;
    default:
      return PALETTE_COLORS.black;
  }
};

const AnnouncementsGrid = () => {
  const {data: announcements = []} = useListContext();

  const isSmall = useMediaQuery("(max-width:900px)");
  const isDesktop = useMediaQuery("(min-width:1400px)");
  const getJustifyContent = (isSmall: boolean, isDesktop: boolean): string => {
    if (isSmall) {
      return "center";
    } else if (isDesktop) {
      return "space-evenly";
    } else {
      return "flex-start";
    }
  };

  return (
    <Box
      overflow="auto"
      maxHeight="80vh"
      display="flex"
      flexWrap="wrap"
      gap="0.5rem"
      padding="1.5rem 0.5vw"
      justifyContent={getJustifyContent(isSmall, isDesktop)}
    >
      {announcements.map((announcement: Announcement) => (
        <Card key={announcement.id} style={cardStyle}>
          <Link to={`/announcements/${announcement.id}/show`}>
            <CardMedia
              component="img"
              height="100"
              image={getBgImg(announcement?.scope!)}
              alt="Announcement Background"
              sx={{borderRadius: "7px 7px 0px 0px"}}
            />
          </Link>
          <CardHeader
            avatar={
              <Avatar
                src={announcement.author?.profile_picture}
                sx={{
                  width: 85,
                  height: 85,
                  borderRadius: "1rem",
                  boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.25)",
                }}
              />
            }
            title={<EmailField value={announcement.author?.email} />}
            subheader={new Date(
              announcement?.creation_datetime!
            ).toLocaleString()}
            sx={{
              paddingBottom: "0 !important",
              display: "flex",
              alignItems: "flex-end",
              marginTop: "-3.5rem",
            }}
          />
          <Link
            to={`/announcements/${announcement.id}/show`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                noWrap
                textOverflow="ellipsis"
              >
                {announcement.title}
              </Typography>
              <Typography variant="body2">
                Cliquez sur la carte pour accéder à l'annonce complète et
                découvrir tous les détails pertinents.
              </Typography>
            </CardContent>
            <CardContent
              sx={{
                padding: "5px 10px",
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 10,
                paddingBlock: "0.5rem",
              }}
            >
              <Chip
                label={ANNOUNCEMENT_SCOPE[announcement?.scope!]}
                sx={{
                  backgroundColor: getChipColor(announcement?.scope!),
                  color: PALETTE_COLORS.white,
                  borderRadius: "4px",
                }}
              />
            </CardContent>
          </Link>
        </Card>
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
  const {isManager} = useRole();

  return (
    <List
      actions={false}
      pagination={<PrevNextPagination />}
      resource="announcements"
      empty={false}
      sx={{
        "& .RaList-content": {
          backgroundColor: "none",
          boxShadow: "none",
        },
        "mt": 2,
      }}
    >
      <HaListTitle
        actions={isManager() && <AnnouncementActions />}
        filterIndicator={true}
        title="Liste des annonces"
        icon={<AnnouncementIcon />}
        mainSearch={{source: "", label: ""}}
      />
      <AnnouncementsGrid />
    </List>
  );
};
