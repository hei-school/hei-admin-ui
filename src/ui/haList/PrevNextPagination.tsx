import {useListContext} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {
  Box,
  IconButton,
  LinearProgress,
  SxProps,
  Toolbar,
  Typography,
} from "@mui/material";

export const pageSize = 10;

const BOX_STYLE: SxProps = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  height: "2.1rem",
  justifyContent: "center",
  minWidth: "unset",
  padding: 0,
  borderRadius: "5px",
  boxShadow: "1px 1px 5px #8182a0",
  color: PALETTE_COLORS.primary,
  background: "whitesmoke",
};

export const PrevNextPagination = () => {
  const {
    page,
    data,
    setPage,
    isLoading,
    isFetching,
    hasNextPage,
    hasPreviousPage,
  } = useListContext();

  return (
    <>
      {(isLoading || isFetching) && <LinearProgress />}
      <Toolbar
        sx={{
          background: "#d4d4de",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            fontWeight="900"
            color={PALETTE_COLORS.yellow}
            textTransform="initial"
          >
            <span
              style={{
                color: PALETTE_COLORS.primary,
                marginRight: "5px",
              }}
            >
              Page :
            </span>
            {page}
            <span
              style={{
                color: PALETTE_COLORS.primary,
                marginInline: "10px",
              }}
            >
              Taille :
            </span>
            {data ? data.length : 0}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          {hasPreviousPage && (
            <IconButton
              sx={{...BOX_STYLE}}
              onClick={() => setPage(page - 1)}
              id="prev-button"
              disabled={isFetching}
            >
              <ChevronLeft sx={{fontSize: "1.7rem"}} />
            </IconButton>
          )}
          <Box sx={{...BOX_STYLE, borderRadius: "50%", width: "2.1rem"}}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PALETTE_COLORS.primary,
                fontWeight: "900",
                borderRadius: "50%",
                backgroundColor: "#d4d4de",
                height: "1.6rem",
                width: "1.6rem",
              }}
            >
              {page}
            </Typography>
          </Box>
          {hasNextPage && (
            <IconButton
              onClick={() => setPage(page + 1)}
              id="next-button"
              sx={{...BOX_STYLE}}
              disabled={isFetching}
            >
              <ChevronRight sx={{fontSize: "1.7rem"}} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </>
  );
};
