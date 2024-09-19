import {FC} from "react";
import {List} from "react-admin";
import {Box, useMediaQuery} from "@mui/material";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {getListViewStyle} from "@/operations/letters/StudentLettersList";
import {
  HeaderLetterList,
  LetterListView,
} from "@/operations/letters/components";

export const LettersList: FC<{
  total: string;
  received: string;
  pending: string;
  rejected: string;
}> = ({total, received, pending, rejected}) => {
  const isSmall = useMediaQuery("(max-width:900px)");
  const isLarge = useMediaQuery("(min-width:1700px)");

  return (
    <Box>
      <List
        title=" "
        resource="letters"
        empty={false}
        actions={false}
        pagination={<PrevNextPagination />}
      >
        <HeaderLetterList
          total={total}
          received={received}
          pending={pending}
          rejected={rejected}
        />
        <LetterListView sx={getListViewStyle({isLarge, isSmall})} />
      </List>
    </Box>
  );
};
