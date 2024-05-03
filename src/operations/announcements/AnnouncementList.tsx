import React, {FC} from "react";

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
import {PALETTE_COLORS} from "@/ui/constants";
import {HaListTitle} from "@/ui/haList";
import {CreateButton} from "@/ui/haToolbar";
import {AnnouncementFilter} from "./components";
import {ANNOUNCEMENT_SCOPE} from "./utils/constants/announcementsScopes";
import {PrevNextPagination} from "../utils";
import {EmailField} from "./components/EmailField";
import {getBgImg} from "./utils/getBgImg";

const cardStyle: React.CSSProperties = {
  width: 300,
  minHeight: 300,
  margin: "0.5em",
  display: "inline-block",
  verticalAlign: "top",
  borderRadius: "7px 7px 0px 0px",
  boxShadow:
    "rgba(0, 0, 0, 0.24) 0px 3px 8pxrgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
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

  return (
    <Box style={{margin: "1em", overflowY: "auto", maxHeight: "80vh"}}>
      {announcements.map((announcement: Announcement) => (
        <Card key={announcement.id} style={cardStyle}>
          <Link to={`/announcements/${announcement.id}/show`}>
            <CardMedia
              component="img"
              height="150"
              image={getBgImg(announcement?.scope!)}
              alt="Announcement Background"
              sx={{borderRadius: "7px 7px 0px 0px"}}
            />
          </Link>
          <CardHeader
            avatar={<Avatar src={announcement.author?.profile_picture} />}
            title={<EmailField value={announcement.author?.email} />}
            subheader={new Date(
              announcement?.creation_datetime!
            ).toLocaleString()}
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
              }}
            >
              <Chip
                label={ANNOUNCEMENT_SCOPE[announcement?.scope!]}
                sx={{
                  backgroundColor: getChipColor(announcement?.scope!),
                  color: PALETTE_COLORS.white,
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
  return (
    <List
      actions={false}
      pagination={<PrevNextPagination />}
      resource="announcements"
      sx={{
        "& .RaList-content": {
          backgroundColor: "none",
          boxShadow: "none",
        },
        "mt": 2,
      }}
    >
      <HaListTitle
        actions={<AnnouncementActions />}
        filterIndicator={true}
        title="Liste des annonces"
        icon={<AnnouncementIcon />}
        mainSearch={{source: "", label: ""}}
      />
      <AnnouncementsGrid />
    </List>
  );
};
