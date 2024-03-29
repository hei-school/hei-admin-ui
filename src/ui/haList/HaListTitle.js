import {MoreVert, SearchOutlined} from "@mui/icons-material";
import {Box, Typography, IconButton, Popover} from "@mui/material";
import {styled} from "@mui/styles";
import {useListFilterContext} from "ra-core";
import {useState, createContext} from "react";
import {HaMainSearch} from "./HaMainSearch";

const TitleContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#575757",
  marginBottom: 15,
  padding: "15px 20px",
  borderBottom: "1px solid #e8e9eb",
});

const MainSearchContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 5,
  boxShadow: "0px 0px 2px rgba(0,0,0,.3)",
  padding: "0px 15px",
  borderRadius: "15px",
});

export const HaListContext = createContext();

export function HaListTitle({
  title,
  icon,
  actions,
  mainSearch,
  filterIndicator,
}) {
  const [showAction, setShowAction] = useState(null);
  const {filterValues} = useListFilterContext();
  const closeAction = () => setShowAction(null);
  const isFilterApplied = Object.keys(filterValues).length;

  const showIndication = {
    "position": "relative",
    "display": "block !important",
    "::after": {
      content: '""',
      display: "block",
      width: "7px",
      position: "absolute",
      height: "7px",
      bgcolor: "blue",
      top: "2px",
      borderRadius: "50%",
      right: "5px",
    },
  };

  return (
    <TitleContainer>
      <Box sx={{display: "flex", alignItems: "center", gap: 2.5}}>
        {icon}
        <Typography variant="h3" sx={{fontSize: "1.07em", fontWeight: 500}}>
          {title}
        </Typography>
      </Box>
      <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
        {mainSearch.source !== "" && (
          <MainSearchContainer>
            <HaMainSearch source={mainSearch.source} label={mainSearch.label} />
            <label htmlFor="main-search">
              <SearchOutlined
                sx={{p: 0, transform: "translateY(4px)", cursor: "pointer"}}
              />
            </label>
          </MainSearchContainer>
        )}
        {actions && (
          <Box
            data-testid="menu-list-action"
            sx={isFilterApplied && filterIndicator ? showIndication : undefined}
          >
            <IconButton onClick={(event) => setShowAction(event.currentTarget)}>
              <MoreVert />
            </IconButton>
          </Box>
        )}
      </Box>
      <HaListContext.Provider value={{closeAction}}>
        <Popover
          open={showAction !== null}
          anchorEl={showAction}
          onClose={closeAction}
          anchorOrigin={{vertical: "top", horizontal: "right"}}
          transformOrigin={{vertical: "top", horizontal: "right"}}
        >
          <Box sx={{width: "150px"}}>{actions}</Box>
        </Popover>
      </HaListContext.Provider>
    </TitleContainer>
  );
}
