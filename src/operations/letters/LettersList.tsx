import {FC} from "react";
import {List} from "react-admin";
import {Box} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";
import LettersPagination from "@/operations/letters/components/LettersPagination";
import LettersContent from "@/operations/letters/components/LetterContent";

const LettersList: FC = () => {
  return (
    <Box>
      <List
        title=" "
        resource="letters"
        empty={false}
        actions={false}
        pagination={<LettersPagination />}
        disableSyncWithLocation
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
          isStudentLetters={false}
        />
      </List>
    </Box>
  );
};

export default LettersList;
