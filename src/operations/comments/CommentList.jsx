import {Box, CircularProgress, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {Link, useGetList} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "../../hooks";
import {useRole} from "../../security/hooks";
import {DATE_OPTIONS, TIME_OPTIONS} from "../../utils/date";
import {getUserRoleInFr} from "../common/utils/typo_util";
import {CommentCreate} from "./CommentCreate";
import {Separator} from "./utils";

import defaultProfilePicture from "../../assets/blank-profile-photo.png";

const ITEMS_PER_PAGE = 10;

const COMMENT_ITEM_STYLE = {
  "mb": 1,
  "bgcolor": "white",
  "p": 1,
  "boxShadow": "1px 1px 5px rgba(0,0,0,.3)",
  "borderRadius": "5px",
  "&:hover": {
    background: PALETTE_COLORS.lightgrey,
  },
};

export function CommentItem({comment, studentId, close}) {
  const {observer, subject} = comment;
  const profilePicture = observer?.profile_picture || defaultProfilePicture;
  const creationDatetime = new Date(comment.creation_datetime).toLocaleString(
    "fr-FR",
    {...DATE_OPTIONS, ...TIME_OPTIONS}
  );

  return (
    <Link
      to={studentId ? "#" : `/students/${subject.id}/show`}
      onClick={() => {
        !studentId && close();
      }}
    >
      <Box data-testid="comment-item" sx={COMMENT_ITEM_STYLE}>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <img
              src={profilePicture}
              style={{width: "35px", height: "35px", borderRadius: "50%"}}
              alt="student"
            />
            <div>
              <Typography
                variant="h5"
                color={PALETTE_COLORS.black}
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  opacity: 0.9,
                  display: "inline-flex",
                  gap: 1,
                }}
              >
                <span>{observer.last_name}</span>
                <span>{observer.first_name}</span>
              </Typography>
              <Typography
                color={PALETTE_COLORS.black}
                sx={{fontSize: "14px", opacity: 0.9}}
              >
                {getUserRoleInFr(observer.role)}
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
          <Typography
            variant="body2"
            color={PALETTE_COLORS.primary}
            fontWeight="bolder"
          >
            {studentId
              ? ""
              : `#${comment.subject.ref ?? "Référence non-définie"} : `}
          </Typography>
          {comment.content}
        </Typography>
      </Box>
    </Link>
  );
}

export function CommentList({studentId, close}) {
  const listContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [shownComments, setShowComments] = useState([]);
  const notify = useNotify();
  const role = useRole();

  const {
    data: comments,
    isLoading,
    error,
    refetch: refetchList,
  } = useGetList("comments", {
    pagination: {page, perPage: ITEMS_PER_PAGE},
    filter: {studentId},
  });
  const isDataAvalaible = !isLoading && comments;
  const isEndOfPage = isDataAvalaible && comments.length < ITEMS_PER_PAGE;

  useEffect(() => {
    if (!comments) return;
    setShowComments((prev) => (page === 1 ? comments : [...prev, ...comments]));
  }, [page, comments]);

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
      {!role.isStudent() && !role.isMonitor() && studentId && (
        <CommentCreate refetchList={refetchList} studentId={studentId} />
      )}
      <Box
        ref={listContainerRef}
        onScroll={showNextComments}
        data-testid="comment-list-wrapper"
        sx={{
          bgcolor: "#f2f1ed",
          px: 1,
          py: 2,
          overflowY: "auto",
          maxHeight: "600px",
        }}
      >
        {shownComments.map((comment, index) => (
          <CommentItem
            key={index}
            comment={comment}
            studentId={studentId}
            close={close}
          />
        ))}
        {isDataAvalaible && shownComments.length < 1 && (
          <Typography
            sx={{
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "bold",
              color: PALETTE_COLORS.black,
              opacity: 0.7,
            }}
          >
            Pas encore de commentaires
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
    </>
  );
}
