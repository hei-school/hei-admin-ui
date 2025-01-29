import {useEffect, useState} from "react";
import {useListContext} from "react-admin";

import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {Button, Toolbar, Typography} from "@mui/material";

export const pageSize = 10;

export const PrevNextPagination = () => {
  const [lastPage, setLastPage] = useState(0);
  const {page, data, isLoading, setPage} = useListContext();
  const resourcesCount = data ? Object.keys(data).length : 0;

  //unmount
  useEffect(
    () => () => {
      localStorage.setItem("RaStore.fees.listParams", "");
    },
    []
  );

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
    setPage(lastPage);
  }

  const onPrevClick = () => {
    setPage(page - 1);
    setLastPage(null);
  };
  return (
    <Toolbar sx={{bgcolor: "white"}}>
      {page > 1 && (
        <Button
          sx={{color: "#575757", textTransform: "none"}}
          color="primary"
          key="prev"
          onClick={onPrevClick}
        >
          <ChevronLeft />
          Précédent
        </Button>
      )}
      {(!lastPage || page < lastPage) && (
        <Button
          sx={{color: "#575757", textTransform: "none"}}
          key="next"
          onClick={() => setPage(page + 1)}
        >
          Suivant
          <ChevronRight />
        </Button>
      )}
      <div style={{marginLeft: "auto"}}>
        <Typography variant="body2" sx={{color: "#575757"}}>
          Page : {page} &nbsp;&nbsp;Taille : {resourcesCount}
        </Typography>
      </div>
    </Toolbar>
  );
};
