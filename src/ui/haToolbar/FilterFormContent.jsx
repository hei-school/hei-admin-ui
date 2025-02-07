import {Box, Button, Dialog, styled, Typography} from "@mui/material";
import useHaToolbarContext from "./useHaToolbarContext";

const FilterContainer = styled("div")({
  padding: 15,
  overflowX: "hidden",
  maxHeight: "500px",
  maxWidth: "350px",
  overflowY: "auto",
});

//TODO: maybe can use popover instead of Dialog for small screen
export function FilterContentResponsive({
  anchorEl,
  onClose,
  onSubmit,
  children,
}) {
  return (
    <Dialog open={Boolean(anchorEl)} onClose={() => onClose(false)}>
      <FilterContent {...{onClose, onSubmit}}>{children}</FilterContent>
    </Dialog>
  );
}

function FilterContent({onClose, onSubmit, children}) {
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
}
