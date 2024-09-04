import {FC} from "react";
import {List} from "react-admin";
import {Box} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import LettersContent from "@/operations/letters/components/LetterListView";

const LettersList: FC = () => (
  <Box>
    <List
      title=" "
      resource="letters"
      empty={false}
      actions={false}
      pagination={<PrevNextPagination />}
      disableSyncWithLocation
      perPage={6}
    >
      <Box
        sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          paddingBlock: "1rem",
          backgroundColor: PALETTE_COLORS.primary,
          color: PALETTE_COLORS.white,
        }}
      >
        Liste de toutes les lettres
      </Box>
      <LettersContent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "3rem",
        }}
        isStudentLetter={false}
      />
    </List>
  </Box>
);

export default LettersList;
