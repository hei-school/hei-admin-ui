import {useEffect, useState} from "react";
import {useListContext} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {ChevronLeft, ChevronRight, ExpandMore} from "@mui/icons-material";
import {
  Box,
  Fade,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  SxProps,
  Toolbar,
  Typography,
} from "@mui/material";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

let pageSize = 10;

const updatePageSize = (newSize: number) => {
  pageSize = newSize;
  if (typeof window !== "undefined") {
    localStorage.setItem("pageSize", newSize.toString());
  }
};

if (typeof window !== "undefined") {
  const savedSize = localStorage.getItem("pageSize");
  if (savedSize) {
    pageSize = parseInt(savedSize, 10);
  }
}

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

const PageSizeSelector = ({
  currentSize,
  onChange,
}: {
  currentSize: number;
  onChange: (size: number) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (size: number) => {
    onChange(size);
    handleClose();
  };

  return (
    <Box sx={{position: "relative", display: "inline-block"}}>
      <Box
        onClick={handleClick}
        sx={{
          "display": "flex",
          "alignItems": "center",
          "cursor": "pointer",
          "padding": "4px 12px",
          "borderRadius": "16px",
          "backgroundColor": "rgba(255, 255, 255, 0.15)",
          "transition": "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
          },
        }}
      >
        <Typography variant="body2" sx={{marginRight: 1, fontWeight: 500}}>
          {currentSize} éléments
        </Typography>
        <ExpandMore sx={{fontSize: "1rem"}} />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            marginTop: "8px",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <MenuItem
            key={size}
            onClick={() => handleSelect(size)}
            selected={size === currentSize}
            sx={{
              "minWidth": "120px",
              "&.Mui-selected": {
                "backgroundColor": "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
              },
            }}
          >
            {size} éléments
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
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
    perPage,
    setPerPage,
  } = useListContext();

  const [localPageSize, setLocalPageSize] = useState(perPage ?? pageSize);

  useEffect(() => {
    setLocalPageSize(perPage ?? pageSize);
  }, [perPage]);

  useEffect(() => {
    if (localPageSize !== perPage) {
      updatePageSize(localPageSize);
      setPerPage(localPageSize);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPageSize]);

  return (
    <>
      {(isLoading || isFetching) && <LinearProgress />}
      <Toolbar
        sx={{
          background: "#d4d4de",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          minHeight: "56px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          margin: "8px 0",
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
          <Typography
            variant="body1"
            fontWeight="700"
            color={PALETTE_COLORS.primary}
            textTransform="initial"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: "4px 12px",
              borderRadius: "16px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <span>Page: {page}</span>
            <span style={{opacity: 0.6}}>•</span>
            <span>Taille: {data ? data.length : 0}</span>
          </Typography>

          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Typography variant="body2" color={PALETTE_COLORS.primary}>
              Listes par page :
            </Typography>
            <PageSizeSelector
              currentSize={localPageSize}
              onChange={setLocalPageSize}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap="0.8rem">
          {hasPreviousPage && (
            <IconButton
              sx={{
                ...BOX_STYLE,
                "transform": "scale(1)",
                "transition": "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              onClick={() => setPage(page - 1)}
              id="prev-button"
              disabled={isFetching}
              aria-label="Page précédente"
            >
              <ChevronLeft sx={{fontSize: "1.7rem"}} />
            </IconButton>
          )}

          <Box
            sx={{
              ...BOX_STYLE,
              "borderRadius": "50%",
              "width": "2.4rem",
              "height": "2.4rem",
              "position": "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-2px",
                left: "-2px",
                right: "-2px",
                bottom: "-2px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #7575ff, #b84dff)",
                zIndex: -1,
                opacity: 0.7,
                transition: "all 0.3s ease",
              },
              "&:hover::before": {
                opacity: 1,
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PALETTE_COLORS.primary,
                fontWeight: "900",
                borderRadius: "50%",
                backgroundColor: "white",
                height: "2rem",
                width: "2rem",
                fontSize: "0.95rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {page}
            </Typography>
          </Box>

          {hasNextPage && (
            <IconButton
              sx={{
                ...BOX_STYLE,
                "transform": "scale(1)",
                "transition": "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              onClick={() => setPage(page + 1)}
              id="next-button"
              disabled={isFetching}
              aria-label="Page suivante"
            >
              <ChevronRight sx={{fontSize: "1.7rem"}} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </>
  );
};
