import {FC} from "react";

import {PALETTE_COLORS} from "@/haTheme";
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
        sx={{width: 120, height: 120, borderRadius: "1rem"}}
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
    <Box
      width="75vw"
      margin="auto"
      marginTop="1rem"
      borderBottom="5px solid"
      position="relative"
      borderColor={PALETTE_COLORS.yellow}
    >
      <Card>
        <CardMedia
          component="img"
          height="150"
          image={getBgImg(announcement.scope)}
          alt="Announcement Background"
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "-5rem",
          }}
        >
          <AnnouncementAuthorShow author={announcement.author} />
          <Typography variant="caption">
            {new Date(announcement.creation_datetime).toLocaleString()}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
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
        </CardContent>
      </Card>
    </Box>
  );
};
