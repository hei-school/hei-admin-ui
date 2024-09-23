import {FC, useState} from "react";
import {ListBase, TopToolbar, useRecordContext} from "react-admin";
import {Box, Button} from "@mui/material";
import {CloudUpload, Tune} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {
  LetterListView,
  LetterStatusFilter,
} from "@/operations/letters/components";
import {Student} from "@haapi/typescript-client";

export const getListViewStyle = ({
  isLarge,
  isSmall,
}: {
  isLarge: boolean;
  isSmall: boolean;
}): React.CSSProperties => {
  return {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: isSmall ? "center" : "flex-start",
    gap: isSmall ? "1rem" : isLarge ? "1.4rem" : "1.6rem",
    padding: isLarge ? "1rem" : "0.5rem 2.5rem",
  };
};

export const StudentLettersList: FC = () => {
  const [isOpen, , onToggle] = useToggle();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const student = useRecordContext<Student>();

  return (
    !!student && (
      <Box
        sx={{
          backgroundColor: PALETTE_COLORS.white,
          borderRadius: "16px",
        }}
      >
        <ListBase
          resource="student-letters"
          queryOptions={{
            meta: {
              studentId: student.id,
            },
          }}
        >
          <TopToolbar
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <Button
              startIcon={<Tune />}
              onClick={handleStatusClick}
              sx={{
                "borderRadius": "8px",
                "padding": "0.5rem 1rem",
                "fontWeight": "600",
                "color": PALETTE_COLORS.primary,
                "backgroundColor": "#f5e4b5",
                "&:hover": {
                  backgroundColor: "#f2db9c",
                },
              }}
              data-testid="letter-status-filter"
            >
              Filtre
            </Button>
            <LetterStatusFilter anchorEl={anchorEl} handleClose={handleClose} />
            <Button
              startIcon={
                <CloudUpload
                  style={{
                    fontSize: "1.5rem",
                  }}
                />
              }
              sx={{
                "backgroundColor": PALETTE_COLORS.primary,
                "color": PALETTE_COLORS.white,
                "borderRadius": "8px",
                "padding": "0.5rem 1rem",
                "fontWeight": "600",
                "&:hover": {
                  backgroundColor: "#1a305a",
                },
              }}
              onClick={onToggle}
              data-testid="letter-create-button"
            >
              Ajouter
            </Button>
          </TopToolbar>
          <LetterListView />
          <PrevNextPagination />
        </ListBase>
        <CreateLettersDialog
          isOpen={isOpen}
          onClose={onToggle}
          studentId={student.id!}
        />
      </Box>
    )
  );
};
