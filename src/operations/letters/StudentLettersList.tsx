import {FC} from "react";
import {ListBase, TopToolbar, useRecordContext} from "react-admin";
import {IconButton, Box, useMediaQuery} from "@mui/material";
import {Add} from "@mui/icons-material";

import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {LetterListView} from "@/operations/letters/components";

const getListContentStyle = ({
  isLarge,
  isSmall,
}:{
  isLarge: boolean;
  isSmall: boolean;
}): React.CSSProperties => {
  return {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: isSmall ? "center" : "flex-start",
    gap: isSmall ? "1rem" : isLarge ? "2.5rem" : "1.6rem",
    padding: isLarge ? "1rem 4rem" : "0.5rem 2.5rem",
  };
};

export const StudentLettersList: FC = () => {
  const [isOpen, , onToggle] = useToggle();
  const {id: studentId} = useRecordContext();
  const isSmall = useMediaQuery("(max-width:900px)");
  const isLarge = useMediaQuery("(min-width:1700px)");

  return (
    <Box
      sx={{
        backgroundColor: PALETTE_COLORS.white,
        borderRadius: "16px",
        padding: "1rem",
      }}
    >
      <ListBase
        resource="student-letters"
        queryOptions={{
          meta: {
            studentId,
          },
        }}
        perPage={12}
      >
        <TopToolbar>
          <IconButton
            sx={{
              "backgroundColor": PALETTE_COLORS.primary,
              "color": PALETTE_COLORS.white,
              "borderRadius": "8px",
              "padding": "0.5rem",
              "&:hover": {
                backgroundColor: "#1a305a",
              },
            }}
            onClick={onToggle}
          >
            <Add
              style={{
                fontSize: "1.7rem",
              }}
            />
          </IconButton>
        </TopToolbar>
        <LetterListView
          sx={getListContentStyle({isLarge, isSmall})}
          isStudentLetter={true}
        />
        <PrevNextPagination />
      </ListBase>
      <CreateLettersDialog
        isOpen={isOpen}
        onClose={onToggle}
        studentId={studentId}
      />
    </Box>
  );
};

