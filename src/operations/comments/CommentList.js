import { Box, Typography, CircularProgress } from "@mui/material"
import { useRef, useState } from "react";
import { useGetList } from "react-admin";

import { useNotify } from "../../hooks";
import defaultProfilePicture from "../../assets/blank-profile-photo.png";
import { PALETTE_COLORS } from "../../ui/constants/palette";
import { ROLE_RENDERER } from "../../ui/utils/utils";
import { Separator } from "./utils";

const LIST_PER_PAGE = 10;

const COMMENT_ITEM_STYLE = {
  mb: 1,
  bgcolor: "white",
  p: 1,
  boxShadow: "1px 1px 5px rgba(0,0,0,.3)",
  borderRadius: "5px"
}

export function CommentItem({ comment }) {
  const { subject, observer } = comment;
  const profilePicture = subject?.profile_picture;

  return (
    <Box sx={COMMENT_ITEM_STYLE}>
      <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={profilePicture || defaultProfilePicture}
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
          <div>
            <Typography
              variant="h5"
              color={PALETTE_COLORS.black}
              sx={{ fontSize: "13px", fontWeight: "bold", opacity: .8 }}
            >
              {observer.first_name}
            </Typography>
            <Typography
              color={PALETTE_COLORS.black}
              sx={{ fontSize: "13px", opacity: .8 }}
            >
              {ROLE_RENDERER[observer.role]}
            </Typography>
          </div>
        </Box>
        <Typography
          sx={{ fontSize: "13px", color: PALETTE_COLORS.black, opacity: .7, fontWeight: "bold" }}
        >
          {new Date(comment.creation_datetime).toLocaleDateString()}
        </Typography>
      </Box>
      <Separator style={{ margin: "5px 0", opacity: .5 }} />
      <Typography sx={{ fontSize: "13px", color: PALETTE_COLORS.black, opacity: .8 }}>
        {comment.content}
      </Typography>
    </Box>
  )
}


export function CommentList() {
  const listContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const notify = useNotify();
  const { data, isLoading, error } = useGetList(
    "comments",
    { pagination: { page, perPage: LIST_PER_PAGE } }
  );

  const isDataAvalaible = !isLoading && data;
  const isEndOfPage = isDataAvalaible && (data.length < page * LIST_PER_PAGE);

  if (error)
    notify("Une erreur s'est produite");

  const showNextComments = () => {
    if (isEndOfPage)
      return;

    const currentHeight = listContainerRef.current.scrollTop + listContainerRef.current.clientHeight;
    if (currentHeight === listContainerRef.current.scrollHeight) {
      setPage(prev => prev + 1);
    }
  }

  return (
    <Box
      ref={listContainerRef}
      onScroll={showNextComments}
      sx={{
        bgcolor: "#f2f1ed",
        px: 1,
        py: 2,
        maxHeight: "300px",
        overflowY: "auto"
      }}
    >
      {isDataAvalaible && data.map((comment, index) => <CommentItem key={index} comment={comment} />)}
      {(isDataAvalaible && data.length < 1) && (
        <Typography
          sx={{
            fontSize: "14px",
            textAlign: "center",
            fontWeight: "bold",
            color: PALETTE_COLORS.black,
            opacity: .7
          }}
        >
          Pas encore de commentaire
        </Typography>
      )}
      {
        isLoading && (
          <Box sx={{ width: "100%", display: "flex", alignItems: "100%", justifyContent: "center" }}>
            <CircularProgress size={30} sx={{ my: 1 }} />
          </Box>
        )
      }
    </Box>
  )
}
