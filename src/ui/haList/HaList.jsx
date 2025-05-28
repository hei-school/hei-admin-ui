import {PALETTE_COLORS} from "@/haTheme";
import {Box, styled} from "@mui/material";
import {Datagrid, List} from "react-admin";
import {HaListTitle} from "./HaListTitle";
import {PrevNextPagination} from "./PrevNextPagination";

const ListWrapper = styled("div")({
  width: "calc(100% - 20px)",
  height: "100%",
  overflow: "auto",
  borderRadius: 10,
  boxShadow: "2px 2px 15px rgba(0,0,0,.1)",
  margin: "auto",
  marginTop: 50,
});

const DatagridWrapper = styled("div")({
  "& th, & th span": {
    fontWeight: 550,
    color: "#bf660d",
    justifyContent: "flex-start !important",
    backgroundColor: `${PALETTE_COLORS.bgGrey} !important`,
  },
  "& td span": {
    padding: "5px 1rem",
    display: "flex",
    justifyContent: "flex-start",
  },
  "& thead th span": {
    color: PALETTE_COLORS.typography.black,
  },
  "& tbody .MuiTableRow-root:hover": {
    backgroundColor: "#edf1fa",
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
  wrapperSx = {},
  children,
  icon,
  header = <></>,
  hasDatagrid = true,
  listProps = {},
  datagridProps = {},
  mainSearch = {source: "", label: ""},
  filterIndicator = true,
}) {
  return (
    <ListWrapper sx={wrapperSx}>
      <List
        actions={false}
        pagination={<PrevNextPagination />}
        resource={resource}
        disableSyncWithLocation
        empty={false}
        sx={{
          "& .MuiPaper-root": {boxShadow: "none"},
          "& td": {border: "none"},
        }}
        {...listProps}
      >
        {header}
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
