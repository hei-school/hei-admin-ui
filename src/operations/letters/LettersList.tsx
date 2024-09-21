import {FC, useMemo, useState} from "react";
import {List} from "react-admin";

import {Box, Stack, IconButton, Popover} from "@mui/material";
import {MoreVert} from "@mui/icons-material";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {
  HeaderLetterList,
  LetterListView,
  LettersFilter,
} from "@/operations/letters/components";
import {LetterStats} from "@haapi/typescript-client";
import {HaListContext} from "@/ui/haList";
import {PALETTE_COLORS} from "@/haTheme";

export const LettersList: FC<{stats: LetterStats & {total?: number}}> = ({
  stats,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Box>
      <List
        title=" "
        resource="letters"
        empty={false}
        pagination={<PrevNextPagination />}
        actions={
          <LetterListActions
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}
          />
        }
      >
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          p={2}
        >
          {!!stats && (
            <Box flex={1}>
              <HeaderLetterList stats={stats} />
            </Box>
          )}
          <Box>
            <IconButton
              onClick={(event) => setAnchorEl(event.currentTarget)}
              data-testid="more-button"
            >
              <MoreVert sx={{color: PALETTE_COLORS.primary}} />
            </IconButton>
          </Box>
        </Stack>

        <LetterListView />
      </List>
    </Box>
  );
};

// TODO: extract into reusable component
const LetterListActions: FC<{
  anchorEl: HTMLElement | null;
  onClose: () => void;
}> = ({anchorEl, onClose}) => {
  return (
    <HaListContext.Provider value={useMemo(() => ({closeAction: onClose}), [])}>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Box sx={{width: "150px"}}>
          <LettersFilter />
        </Box>
      </Popover>
    </HaListContext.Provider>
  );
};
