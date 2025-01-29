import {PALETTE_COLORS} from "@/haTheme";
import {MoreVert, SearchOutlined} from "@mui/icons-material";
import {Box, IconButton, Popover, styled, Typography} from "@mui/material";
import {useListFilterContext} from "ra-core";
import {createContext, useState} from "react";
import {HaMainSearch} from "./HaMainSearch";

const TitleContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#575757",
  marginBottom: 5,
  padding: "15px 20px",
});

const MainSearchContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  boxShadow: "0px 0px 2px rgba(0,0,0,.3)",
  padding: "0px 15px",
  borderRadius: "5px",
  backgroundColor: PALETTE_COLORS.bgGrey,
});

export const HaListContext = createContext({closeAction: () => {}});

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
        <Typography sx={{fontSize: "1.15em", fontWeight: 500}}>
          {title}
        </Typography>
      </Box>
      <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
        {mainSearch.source !== "" && (
          <MainSearchContainer>
            <label htmlFor="main-search">
              <SearchOutlined
                sx={{
                  p: 0,
                  transform: "translateY(4px)",
                  cursor: "pointer",
                  color: PALETTE_COLORS.primary,
                }}
              />
            </label>
            <HaMainSearch source={mainSearch.source} label={mainSearch.label} />
          </MainSearchContainer>
        )}
        {actions && (
          <Box
            data-testid="menu-list-action"
            sx={isFilterApplied && filterIndicator ? showIndication : undefined}
          >
            <IconButton onClick={(event) => setShowAction(event.currentTarget)}>
              <MoreVert sx={{color: PALETTE_COLORS.primary}} />
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
          <Box sx={{width: "165px"}}>{actions}</Box>
        </Popover>
      </HaListContext.Provider>
    </TitleContainer>
  );
}
