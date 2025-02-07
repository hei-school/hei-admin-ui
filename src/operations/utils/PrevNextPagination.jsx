import {useState} from "react";
import {useListContext} from "react-admin";

import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {Button, Toolbar, Typography} from "@mui/material";

export const pageSize = 10;

export const PrevNextPagination = () => {
  const [lastPage, setLastPage] = useState(0);
  const {page, data, isLoading, setPage} = useListContext();
  const resourcesCount = data ? Object.keys(data).length : 0;
  if (
    !lastPage &&
    lastPage !== 0 /* TODO(empty-pages): test! */ &&
    !isLoading &&
    resourcesCount === 0
  ) {
    setLastPage(page - 1);
    setPage(page - 1);
  }
  if (lastPage && page === 1) {
    // react-admin redirects to page 1 if no more data to show
    // We dont't like that behavior!
    // Let the user stay on the last page.
    setPage(lastPage);
  }

  const onPrevClick = () => {
    setPage(page - 1);
    setLastPage(null);
  };
  return (
    <Toolbar>
      {page > 1 && (
        <Button color="primary" key="prev" onClick={onPrevClick}>
          <ChevronLeft />
          Précédent
        </Button>
      )}
      {(!lastPage || page < lastPage) && (
        <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
          Suivant
          <ChevronRight />
        </Button>
      )}
      <div style={{marginLeft: "auto"}}>
        <Typography variant="body2">
          Page : {page} &nbsp;&nbsp;Taille : {resourcesCount}
        </Typography>
      </div>
    </Toolbar>
  );
};
