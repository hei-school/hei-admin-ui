import React, {FC} from "react";

import {
  Typography,
  Box,
  Avatar,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import {Show, SimpleShowLayout, useGetOne} from "react-admin";
import {MarkdownField} from "@react-admin/ra-markdown";
import {useParams} from "react-router-dom";
import {AnnouncementAuthor} from "@haapi/typescript-client";
import {EmailField} from "./components/EmailField";
import {getBgImg} from "./utils/getBgImg";

interface AuthorProps {
  author: AnnouncementAuthor;
}

const AnnouncementAuthorShow: FC<AuthorProps> = ({author}) => {
  if (!author) return;

  return (
    <Box display="flex">
      <Avatar src={author.profile_picture} />
      <Box display="flex" flexDirection="column">
        <Typography variant="caption" fontWeight="bold" marginLeft={1}>
          {author.first_name} {author.last_name}
        </Typography>
        <EmailField
          value={
            <Typography variant="caption" marginLeft={1}>
              {author.email}
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};

export const AnnouncementShow = () => {
  const {id} = useParams();
  const {data: announcement = []} = useGetOne("announcements", {id});
  if (!announcement) return;
  return (
    <Box width="65vw" margin="auto">
      <Box
        display="flex"
        paddingY={2}
        paddingX={3}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {announcement.title}
          </Typography>
          <Typography variant="caption">
            {new Date(announcement.creation_datetime).toLocaleString()}
          </Typography>
        </Box>
        <AnnouncementAuthorShow author={announcement.author} />
      </Box>
      <Card>
        <CardMedia
          component="img"
          height="250"
          image={getBgImg(announcement.scope)}
          alt="Announcement Background"
        />
        <CardContent sx={{marginTop: "-175px", bgcolor: "whitesmoke"}}>
          <Show
            resource="announcements"
            title="Annonce"
            sx={{
              "& .RaShow-card": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }}
          >
            <SimpleShowLayout
              sx={{
                minHeight: "65vh",
                bgcolor: "white",
                width: "50vw",
                margin: "auto",
                borderRadius: "7px 7px 0px 0px",
              }}
            >
              <MarkdownField
                source="content"
                label=" "
                sx={{padding: "auto", fontSize: "1rem"}}
              />
            </SimpleShowLayout>
          </Show>
        </CardContent>
      </Card>
    </Box>
  );
};
