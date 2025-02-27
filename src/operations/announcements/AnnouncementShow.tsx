import {FC} from "react";

import {AnnouncementAuthor} from "@haapi/typescript-client";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import {MarkdownField} from "@react-admin/ra-markdown";
import {Show, SimpleShowLayout, useGetOne, useRedirect} from "react-admin";
import {useParams} from "react-router-dom";
import {getChipColor} from "./AnnouncementList";
import {EmailField} from "./components/EmailField";
import {getBgImg} from "./utils/getBgImg";

interface AuthorProps {
  author: AnnouncementAuthor;
}

const AnnouncementAuthorShow: FC<AuthorProps> = ({author}) => {
  if (!author) return;

  return (
    <Box display="flex">
      <Avatar
        src={author.profile_picture}
        sx={{width: 50, height: 50, borderRadius: "50%"}}
      />
      <Box display="flex" flexDirection="column" justifyContent="flex-end">
        <Typography
          variant="caption"
          fontWeight="bold"
          marginLeft={1}
          fontSize="1.2rem"
        >
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
  const redirect = useRedirect();
  const {data: announcement = [], isFetching} = useGetOne("announcements", {
    id,
  });

  if (!announcement && !isFetching) redirect("/announcements");

  return (
    <Card
      sx={{
        width: "75vw",
        margin: "auto",
        marginTop: "80px",
        marginBottom: "12px",
        borderBottom: "5px solid",
        position: "relative",
        borderColor: getChipColor(announcement.scope),
        overflow: "visible",
      }}
    >
      <CardMedia
        component="img"
        image={getBgImg(announcement.scope)}
        alt="Announcement Background"
        sx={{
          borderRadius: "50%",
          height: "120px",
          width: "120px",
          marginLeft: "1.5rem",
          position: "absolute",
          top: "-60px",
          border: "4px solid",
          borderColor: getChipColor(announcement?.scope!),
        }}
      />
      <Box
        sx={{
          backgroundColor: getChipColor(announcement?.scope!),
          height: "70px",
          padding: "1rem ",
          borderRadius: "7px 7px 0 0",
        }}
      />
      <Typography variant="h5" fontWeight="bold" margin="1rem 2rem">
        {announcement.title}
      </Typography>
      <Show
        resource="announcements"
        title="Annonce"
        sx={{
          "& .RaShow-card": {
            boxShadow: "none",
          },
        }}
      >
        <SimpleShowLayout
          sx={{
            bgcolor: "white",
            width: "100%",
            borderRadius: "7px 7px 0px 0px",
          }}
        >
          <MarkdownField
            source="content"
            label=" "
            data-testid="markdown-field"
            sx={{padding: "auto", fontSize: "1rem"}}
          />
        </SimpleShowLayout>
      </Show>
      <CardContent>
        <AnnouncementAuthorShow author={announcement.author} />
        <Typography variant="caption">
          {new Date(announcement.creation_datetime).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};
