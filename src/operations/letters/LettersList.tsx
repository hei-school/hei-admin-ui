import {useState} from "react";
import {List} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {
  HeaderLetterList,
  LetterListView,
  LettersFilter,
} from "@/operations/letters/components";
import {ListActionsPopover} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {LetterStats} from "@haapi-b0fc7615/typescript-client";
import {MoreVert} from "@mui/icons-material";
import {Box, IconButton, Stack} from "@mui/material";

export const LettersList = ({
  stats,
}: Readonly<{stats: LetterStats & {total?: number}}>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Box>
      <List
        title=" "
        resource="letters"
        empty={false}
        pagination={<PrevNextPagination />}
        actions={
          <ListActionsPopover
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}
          >
            <LettersFilter />
          </ListActionsPopover>
        }
        disableSyncWithLocation={true}
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
              id="more-button"
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
