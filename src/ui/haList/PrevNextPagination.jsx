import {useListContext} from "react-admin";

import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {Button, Toolbar, Typography} from "@mui/material";

export const pageSize = 10;

export const PrevNextPagination = () => {
  const {page, data, isLoading, setPage, hasNextPage, hasPreviousPage} =
    useListContext();

  return (
    <Toolbar>
      {hasPreviousPage && (
        <Button color="primary" key="prev" onClick={() => setPage(page - 1)}>
          <ChevronLeft />
          Précédent
        </Button>
      )}
      {hasNextPage && (
        <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
          Suivant
          <ChevronRight />
        </Button>
      )}
      <div style={{marginLeft: "auto"}}>
        <Typography variant="body2">
          Page : {page} Taille : {data ? data.length : 0}
        </Typography>
      </div>
    </Toolbar>
  );
};
