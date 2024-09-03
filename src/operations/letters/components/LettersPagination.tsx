import {useState} from "react";
import {useListContext} from "react-admin";
import {Button, Box} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/haTheme";

export const LetterPageSize = 6;

const LettersPagination = () => {
  const [lastPage, setLastPage] = useState(0);
  const {page, data, isLoading, setPage} = useListContext();
  const resourcesCount = data ? Object.keys(data).length : 0;

  if (!lastPage && lastPage !== 0 && !isLoading && resourcesCount === 0) {
    setLastPage(page - 1);
    setPage(page - 1);
  }
  if (lastPage && page === 1) {
    setPage(lastPage);
  }

  const onPrevClick = () => {
    setPage(page - 1);
    setLastPage(0);
  };

  const buttonStyle = {
    "backgroundColor": PALETTE_COLORS.primary,
    "color": PALETTE_COLORS.white,
    "fontSize": "1rem",
    "&: hover": {
      backgroundColor: PALETTE_COLORS.primary,
      color: PALETTE_COLORS.white,
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 2,
        position: "absolute",
        width: "97%",
        bottom: "0",
        padding: "0.5rem",
        marginBottom: "1.2rem",
      }}
    >
      {page > 1 && (
        <Button onClick={onPrevClick} sx={buttonStyle}>
          <ChevronLeft />
          Précédent
        </Button>
      )}
      {(!lastPage || page < lastPage) && (
        <Button onClick={() => setPage(page + 1)} sx={buttonStyle}>
          Suivant
          <ChevronRight />
        </Button>
      )}
    </Box>
  );
};

export default LettersPagination;
