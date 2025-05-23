import {PALETTE_COLORS} from "@/haTheme";
import {AnnouncementAuthor, Scope} from "@haapi/typescript-client";
import {Campaign} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import {FC} from "react";
import {EmailField, Link} from "react-admin";
import {getBgImg} from "../utils/getBgImg";

interface Announcement {
  id: string;
  scope: string;
  title: string;
  author: AnnouncementAuthor;
  creation_datetime: Date;
  isLoading: boolean;
}

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

const cardStyle: React.CSSProperties = {
  minWidth: "300px",
  borderRadius: "7px",
  boxShadow: "0 0 10px rgb(182, 182, 182)",
  borderBottom: "10px solid",
  position: "relative",
  overflow: "visible",
  marginTop: "50px",
};

export const AnnouncementCard: FC<Announcement> = ({
  id,
  scope,
  author,
  creation_datetime,
  isLoading,
  title,
}) => {
  return (
    <Link
      key={id}
      to={`/announcements/${id}/show`}
      sx={{
        ...cardStyle,
        "borderColor": getChipColor(scope),
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
            image={getBgImg(scope)}
            alt="Announcement Background"
            sx={{
              borderRadius: "50%",
              height: "100px",
              width: "100px",
              marginLeft: "1.5rem",
              position: "absolute",
              top: "-45px",
              border: "4px solid",
              borderColor: getChipColor(scope),
            }}
          />
        )}
        <Box
          sx={{
            backgroundColor: getChipColor(scope),
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
            {title}
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
                color: getChipColor(scope),
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
              <EmailField source="author.email" record={{author}} />
              <Typography>
                {new Date(creation_datetime).toLocaleString()}
              </Typography>
            </Box>
            {isLoading ? (
              <Skeleton variant="circular" width={50} height={50} />
            ) : (
              <Avatar
                alt={author?.first_name}
                src={author?.profile_picture}
                sx={{
                  height: 50,
                  width: 50,
                  border: "2px solid",
                  borderColor: getChipColor(scope),
                }}
              />
            )}
          </Box>
        </Box>
      </Card>
    </Link>
  );
};
