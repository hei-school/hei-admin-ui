import {Box, Typography, CircularProgress} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useGetList} from "react-admin";

import {CommentCreate} from "./CommentCreate";
import {useNotify} from "../../hooks";
import {PALETTE_COLORS} from "../../ui/constants/palette";
import {ROLE_RENDERER} from "../../ui/utils/utils";
import {Separator} from "./utils";
import {DATE_OPTIONS, TIME_OPTIONS} from "../utils";
import {useRole} from "../../security/hooks";

const LIST_PER_PAGE = 10;

const COMMENT_ITEM_STYLE = {
  mb: 1,
  bgcolor: "white",
  p: 1,
  boxShadow: "1px 1px 5px rgba(0,0,0,.3)",
  borderRadius: "5px",
};

export function CommentItem({comment}) {
  const {observer} = comment;
  const creationDatetime = new Date(comment.creation_datetime).toLocaleString(
    "fr-FR",
    {...DATE_OPTIONS, ...TIME_OPTIONS}
  );

  return (
    <Box sx={COMMENT_ITEM_STYLE}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <div>
            <Typography
              variant="h5"
              color={PALETTE_COLORS.black}
              sx={{fontSize: "14px", fontWeight: "bold", opacity: 0.9}}
            >
              {observer.first_name}
            </Typography>
            <Typography
              color={PALETTE_COLORS.black}
              sx={{fontSize: "14px", opacity: 0.9}}
            >
              {ROLE_RENDERER[observer.role] || "Non défini.e"}
            </Typography>
          </div>
        </Box>
        <Typography
          sx={{
            fontSize: "13px",
            color: PALETTE_COLORS.black,
            opacity: 0.7,
            fontWeight: "bold",
          }}
        >
          {creationDatetime}
        </Typography>
      </Box>
      <Separator style={{margin: "5px 0", opacity: 0.5}} />
      <Typography
        sx={{fontSize: "14px", color: PALETTE_COLORS.black, opacity: 0.8}}
      >
        {comment.content}
      </Typography>
    </Box>
  );
}

export function CommentList({studentId}) {
  const listContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const role = useRole();

  const notify = useNotify();
  const {data, isLoading, error, refetch} = useGetList("comments", {
    pagination: {page, perPage: LIST_PER_PAGE},
    filter: {studentId},
  });
  const isDataAvalaible = !isLoading && data;
  const isEndOfPage = isDataAvalaible && data.length < LIST_PER_PAGE;

  useEffect(() => {
    if (!data) return;
    setComments((prev) => (page === 1 ? data : [...prev, ...data]));
  }, [page, data]);

  if (error) notify("Une erreur s'est produite", {type: "error"});

  const showNextComments = () => {
    if (isEndOfPage) return;

    const currentHeight =
      listContainerRef.current.scrollTop +
      listContainerRef.current.clientHeight;
    if (currentHeight === listContainerRef.current.scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <Box
        ref={listContainerRef}
        onScroll={showNextComments}
        sx={{
          bgcolor: "#f2f1ed",
          px: 1,
          py: 2,
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {comments.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
        {isDataAvalaible && comments.length < 1 && (
          <Typography
            sx={{
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "bold",
              color: PALETTE_COLORS.black,
              opacity: 0.7,
            }}
          >
            Pas encore de commentaire
          </Typography>
        )}
        {isLoading && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "100%",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={30} sx={{my: 1}} />
          </Box>
        )}
      </Box>
      {!role.isStudent() && (
        <CommentCreate refetch={refetch} studentId={studentId} />
      )}
    </>
  );
}
