import {FC} from "react";
import {List} from "react-admin";
import {Box} from "@mui/material";
import {StudentLettersContent} from "./StudentLetters";
import {PALETTE_COLORS} from "@/haTheme";
import LettersPagination from "./components/LettersPagination";

const LettersList: FC = () => {
  return (
    <Box>
      <List
        title=" "
        resource="letters"
        empty={false}
        actions={false}
        pagination={<LettersPagination />}
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
        <StudentLettersContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "3rem",
          }}
        />
      </List>
    </Box>
  );
};

export default LettersList;
