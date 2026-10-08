import {Box, Button, Dialog, styled, Typography} from "@mui/material";
import {ReactNode} from "react";
import useHaToolbarContext from "./useHaToolbarContext";

const FilterContainer = styled("div")({
  padding: 15,
  overflowX: "hidden",
  maxHeight: "500px",
  maxWidth: "350px",
  overflowY: "auto",
});

interface FilterContentProps {
  onClose: (hasChanged: boolean) => void;
  onSubmit: () => void;
  children?: ReactNode;
}

interface FilterContentResponsiveProps extends FilterContentProps {
  anchorEl: HTMLElement | null;
}

// a Dialog on every screen size; a Popover could fit small screens better
export const FilterContentResponsive = ({
  anchorEl,
  onClose,
  onSubmit,
  children,
}: Readonly<FilterContentResponsiveProps>) => {
  return (
    <Dialog open={Boolean(anchorEl)} onClose={() => onClose(false)}>
      <FilterContent {...{onClose, onSubmit}}>{children}</FilterContent>
    </Dialog>
  );
};

const FilterContent = ({
  onClose,
  onSubmit,
  children,
}: Readonly<FilterContentProps>) => {
  const {setCurrentFilter} = useHaToolbarContext();

  return (
    <FilterContainer>
      <Typography
        sx={{color: "#696b6e", fonSize: "15px", mb: 1, fontWeight: 600}}
      >
        Ajouter des filtres
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 1,
          mt: 3,
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 3,
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          data-testid="cancel-filter"
          onClick={() => onClose(false)}
        >
          Annuler
        </Button>
        <Box>
          <Button
            variant="outlined"
            size="small"
            data-testid="clear-filter"
            onClick={() => setCurrentFilter({})}
            sx={{mr: 1}}
          >
            Effacer
          </Button>
          <Button
            variant="outlined"
            size="small"
            data-testid="apply-filter"
            onClick={() => {
              onSubmit();
              onClose(true);
            }}
          >
            Appliquer
          </Button>
        </Box>
      </Box>
    </FilterContainer>
  );
};
