import {FC} from "react";
import {List, TopToolbar, useRecordContext} from "react-admin";
import {IconButton, Box, useMediaQuery} from "@mui/material";
import {Add} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import LettersContent from "@/operations/letters/components/LetterContent";

interface ListContentStyleProps {
  isLarge: boolean;
  isSmall: boolean;
}

const ListContentStyle = ({
  isLarge,
  isSmall,
}: ListContentStyleProps): React.CSSProperties => {
  const getJustifyContent = () => {
    if (isSmall) return "center";
    return "flex-start";
  };

  const getGap = () => {
    if (isLarge) return "2.3rem";
    if (isSmall) return "1rem";
    return "1.6rem";
  };

  const getPadding = () => (isLarge ? "2rem 6rem" : "2.5rem 3.2rem");

  return {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: getJustifyContent(),
    gap: getGap(),
    padding: getPadding(),
  };
};

const StudentLetters: FC = () => {
  const [isOpen, , toggle] = useToggle();
  const {id: studentId} = useRecordContext();
  const isSmall = useMediaQuery("(max-width:900px)");
  const isLarge = useMediaQuery("(min-width:1700px)");

  return (
    <Box>
      <List
        title=" "
        resource="student-letters"
        empty={false}
        queryOptions={{
          meta: {
            studentId,
          },
        }}
        pagination={<PrevNextPagination />}
        actions={
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
              onClick={toggle}
            >
              <Add
                style={{
                  fontSize: "1.7rem",
                }}
              />
            </IconButton>
          </TopToolbar>
        }
      >
        <LettersContent
          sx={ListContentStyle({isLarge, isSmall})}
          isStudentLetters={true}
        />
      </List>
      <CreateLettersDialog
        isOpen={isOpen}
        toggle={toggle}
        studentId={studentId}
      />
    </Box>
  );
};
export default StudentLetters;
