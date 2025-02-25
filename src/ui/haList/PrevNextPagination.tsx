import {useListContext} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {Box, SxProps, Toolbar, Typography} from "@mui/material";

export const pageSize = 10;

const BOX_STYLE: SxProps = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  height: "2.1rem",
  justifyContent: "space-around",
  padding: "4px",
  borderRadius: "5px",
  width: "2.1rem",
  boxShadow: "1px 1px 5px #8182a0",
  color: PALETTE_COLORS.primary,
  background: "whitesmoke",
};

const ICON_STYLE: SxProps = {
  backgroundColor: "#d4d4de",
  height: "1.6rem",
  width: "1.6rem",
};

export const PrevNextPagination = () => {
  const {page, data, setPage, hasNextPage, hasPreviousPage} = useListContext();

  return (
    <Toolbar
      sx={{
        background: "#d4d4de",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="900" color={PALETTE_COLORS.yellow}>
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
          <Box
            sx={BOX_STYLE}
            onClick={() => setPage(page - 1)}
            id="prev-button"
          >
            <ChevronLeft sx={ICON_STYLE} />
          </Box>
        )}
        <Box sx={{...BOX_STYLE, borderRadius: "50%"}}>
          <Typography
            sx={{
              ...ICON_STYLE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PALETTE_COLORS.primary,
              fontWeight: "900",
              borderRadius: "50%",
            }}
          >
            {page}
          </Typography>
        </Box>
        {hasNextPage && (
          <Box
            onClick={() => setPage(page + 1)}
            id="next-button"
            sx={BOX_STYLE}
          >
            <ChevronRight sx={ICON_STYLE} />
          </Box>
        )}
      </Box>
    </Toolbar>
  );
};
