import {DATE_OPTIONS, TIME_OPTIONS} from "@/utils/date";
import {alpha, Avatar, Box, Button, Chip, Typography} from "@mui/material";
import {BellDot, ExternalLink} from "lucide-react";
import {FC} from "react";
import {Link, useGetList} from "react-admin";

export const CommentContent: FC<{animate: boolean}> = ({animate}) => {
  const {data: comments = []} = useGetList("comments", {
    pagination: {page: 1, perPage: 10},
  });

  return (
    <Box
      sx={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease-out 0.9s",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        width: "100%",
        height: "53vh",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: alpha("#2196F3", 0.1),
          background: `linear-gradient(135deg, ${alpha("#2196F3", 0.1)} 0%, ${alpha("#2196F3", 0.07)} 100%)`,
        }}
      >
        <Box sx={{display: "flex", alignItems: "center"}}>
          <BellDot
            style={{
              color: "#2196F3",
              fontSize: "1.25rem",
              marginRight: "0.75rem",
            }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{fontSize: "1rem"}}>
            Liste des étudiants avec commentaires
          </Typography>
        </Box>
        <Chip
          label={`${comments.length} Commentaires`}
          size="small"
          sx={{
            fontWeight: "bold",
            bgcolor: alpha("#2196F3", 0.2),
            color: "#2196F3",
            border: "1px solid rgba(33, 149, 243, 0.66)",
            padding: "0 4px",
          }}
        />
      </Box>

      <Box
        sx={{
          "paddingBottom": 2,
          "overflowY": " auto",
          "&::-webkit-scrollbar": {
            width: "4px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha("#2196F3", 0.2),
            borderRadius: "4px",
          },
          "scrollbarWidth": "thin",
          "scrollbarColor": `${alpha("#2196F3", 0.2)} transparent`,
          "height": "90%",
        }}
      >
        {comments?.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              "p": 2,
              "borderBottom": "1px solid",
              "borderColor": alpha("#000", 0.06),
              "display": "flex",
              "alignItems": "center",
              "justifyContent": "space-between",
              "transition": "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha("#2196F3", 0.03),
              },
            }}
          >
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Avatar
                src={comment?.subject?.profile_picture}
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  border: "2px solid white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Box>
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                  <Typography fontWeight="bold" sx={{fontSize: "0.9rem"}}>
                    {comment?.subject?.first_name +
                      " " +
                      comment?.subject?.last_name}
                  </Typography>
                  <Chip
                    label={comment?.subject?.groups?.[0]?.ref}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      bgcolor:
                        comment?.subject?.groups?.[0]?.attributed_color ??
                        "#2196F3",
                      color: "white",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      bgcolor: alpha("#2196F3", 0.08),
                      color: "#2196F3",
                      px: 1,
                      py: 0.25,
                      borderRadius: "4px",
                      fontWeight: 500,
                    }}
                  >
                    par {comment?.observer.first_name}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{fontSize: "0.75rem"}}
                >
                  {comment?.subject?.ref} • Le :{" "}
                  {new Date(comment.creation_datetime).toLocaleString("fr-FR", {
                    ...DATE_OPTIONS,
                    ...TIME_OPTIONS,
                  } as any)}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to={`/students/${comment?.subject?.id}/show?tab=comments`}
              size="small"
              endIcon={
                <ExternalLink
                  style={{
                    width: 14,
                    height: 14,
                  }}
                />
              }
              sx={{
                "color": alpha("#2196F3", 0.9),
                "background": alpha("#2196F3", 0.05),
                "textTransform": "none",
                "borderRadius": "6px",
                "fontSize": "0.75rem",
                "padding": "3px 10px",
                "fontWeight": 500,
                "&:hover": {
                  background: alpha("#2196F3", 0.1),
                  boxShadow: "0 2px 8px rgba(244, 67, 54, 0.15)",
                },
              }}
            >
              Voir
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
