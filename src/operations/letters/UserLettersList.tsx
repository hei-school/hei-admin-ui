import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {
  LetterListView,
  LetterStatusFilter,
} from "@/operations/letters/components";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {Student, Teacher} from "@haapi/typescript-client";
import {CloudUpload, Tune} from "@mui/icons-material";
import {Box, Button} from "@mui/material";
import {FC, useState} from "react";
import {ListBase, TopToolbar, useRecordContext} from "react-admin";

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

export const UserLettersList: FC = () => {
  const [isOpen, , onToggle] = useToggle();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const user = useRecordContext<Student | Teacher>();

  if (!user) return null;

  return (
    <Box
      sx={{
        backgroundColor: PALETTE_COLORS.white,
        borderRadius: "16px",
      }}
    >
      <ListBase
        resource="users-letters"
        queryOptions={{
          meta: {
            userId: user.id,
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
        userId={user.id!}
      />
    </Box>
  );
};
