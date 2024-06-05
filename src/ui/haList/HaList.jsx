import {List, Datagrid} from "react-admin";
import {Box, styled} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";
import {PrevNextPagination} from "./PrevNextPagination";
import {HaListTitle} from "./HaListTitle";

const ListWrapper = styled("div")({
  width: "calc(100% - 20px)",
  height: "100%",
  overflow: "hidden",
  borderRadius: 10,
  boxShadow: "2px 2px 15px rgba(0,0,0,.1)",
  margin: "auto",
  marginTop: 50,
});

const DatagridWrapper = styled("div")({
  "& th, & th span": {
    fontWeight: 550,
    color: "#bf660d",
    backgroundColor: `${PALETTE_COLORS.bgGrey} !important`,
  },
  "& td span, & th span": {
    padding: "5px 0",
    display: "flex",
    justifyContent: "center",
  },
  "& thead th span": {
    color: PALETTE_COLORS.typography.black,
  },
  "& tbody .MuiTableRow-root": {
    "&:hover": {backgroundColor: "#edf1fa"},
  },
  "& td": {
    borderBottom: "1px solid",
    borderColor: PALETTE_COLORS.lightgrey,
    padding: "10px 0px",
  },
});

export function HaList({
  title,
  actions,
  resource,
  children,
  icon,
  hasDatagrid = true,
  listProps = {},
  datagridProps = {},
  mainSearch = {source: "", label: ""},
  filterIndicator = true,
}) {
  return (
    <ListWrapper>
      <List
        actions={false}
        pagination={<PrevNextPagination />}
        resource={resource}
        empty={false}
        sx={{
          "& .MuiPaper-root": {boxShadow: "none"},
          "& td": {border: "none"},
        }}
        {...listProps}
      >
        <Box>
          <HaListTitle
            actions={actions}
            filterIndicator={filterIndicator}
            title={title}
            icon={icon}
            mainSearch={mainSearch}
          />
          <DatagridWrapper>
            {hasDatagrid ? (
              <Datagrid
                bulkActionButtons={false}
                rowClick="show"
                {...datagridProps}
              >
                {children}
              </Datagrid>
            ) : (
              children
            )}
          </DatagridWrapper>
        </Box>
      </List>
    </ListWrapper>
  );
}
