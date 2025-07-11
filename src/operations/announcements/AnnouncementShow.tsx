import {useNotify} from "@/hooks";
import {AnnouncementAuthor} from "@haapi/typescript-client";
import {ThumbUpAlt, ThumbUpOffAlt} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import {MarkdownField} from "@react-admin/ra-markdown";
import {FC} from "react";
import {
  Show,
  SimpleShowLayout,
  useGetOne,
  useRedirect,
  useUpdate,
} from "react-admin";
import {useParams} from "react-router-dom";
import {getChipColor} from "./components/AnnoucementCard";
import {EmailField} from "./components/EmailField";
import {ANNOUNCEMENT_SCOPE} from "./utils/constants/announcementsScopes";
import {getBgImg} from "./utils/getBgImg";

interface AuthorProps {
  author: AnnouncementAuthor;
}

const AnnouncementAuthorShow: FC<AuthorProps> = ({author}) => {
  if (!author) return;

  return (
    <Box display="flex">
      {author.profile_picture ? (
        <Avatar
          src={author.profile_picture}
          sx={{width: 50, height: 50, borderRadius: "50%"}}
        />
      ) : (
        <Skeleton variant="circular" width={50} height={50} />
      )}
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
  const [update, {isLoading}] = useUpdate();

  if (!announcement && !isFetching) redirect("/announcements");

  const notify = useNotify();
  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    const payload = {reaction: checked ? "CHECK" : "UNCHECK"};
    update(
      "announcements",
      {
        id,
        meta: {method: "UPDATE", id},
        data: payload,
        previousData: announcement,
      },
      {
        onSuccess: () => {
          notify("Réaction mise à jour avec succès", {
            type: "success",
          });
        },
        onError: (error) => {
          notify("Erreur lors de la mise à jour de la réaction", {
            type: "error",
          });
          console.error(error);
        },
      }
    );
  };

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
          borderColor: getChipColor(announcement?.scope),
        }}
      />
      <Chip
        label={ANNOUNCEMENT_SCOPE[announcement?.scope!]}
        sx={{
          position: "absolute",
          backgroundColor: "white",
          color: getChipColor(announcement?.scope),
          fontWeight: "bold",
          marginBottom: "0.5rem",
          top: "10px",
          right: "10px",
          borderRadius: "5px",
        }}
      />
      <Box
        sx={{
          backgroundColor: getChipColor(announcement?.scope),
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
      <CardContent
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "space-between",
          paddingInline: "1rem",
        }}
      >
        <Box
          sx={{
            textAlign: "start",
          }}
        >
          <AnnouncementAuthorShow author={announcement.author} />
          <Typography variant="caption">
            {new Date(announcement.creation_datetime).toLocaleString()}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Typography fontSize="1rem" fontWeight={900}>
            {announcement.reaction_count ?? 0}
          </Typography>
          <Checkbox
            disabled={isLoading}
            id="reaction"
            checked={announcement.hasCurrentUserReaction ?? false}
            icon={
              <ThumbUpOffAlt
                sx={{color: "#aaa", transition: "all 0.2s ease"}}
              />
            }
            checkedIcon={
              <ThumbUpAlt
                sx={{color: "#2196f3", transition: "all 0.2s ease"}}
              />
            }
            onChange={handleCheckboxChange}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.08)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "1.4rem",
              },
              "padding": "6px",
              "borderRadius": "50%",
              "transition": "all 0.2s ease",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
