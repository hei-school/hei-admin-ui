import {FC} from "react";
import {useListContext} from "react-admin";
import {Box, CircularProgress} from "@mui/material";
import {Letter} from "@haapi/typescript-client";
import {LetterListViewProps} from "@/operations/letters/types";
import EmptyList from "@/ui/components/EmptyList";
import {LetterItem} from "@/operations/letters/components/LetterItem";

export const LetterListView: FC<LetterListViewProps> = ({
  sx,
  isStudentLetter,
}) => {
  const {data: letters = [], isLoading} = useListContext<Required<Letter>>();
  const isEmpty = !letters.length;

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  return (
    <Box sx={sx}>
      {isEmpty && <EmptyList />}
      {letters.map((letter) => (
        <LetterItem
          key={letter.id}
          letter={letter}
          isStudentLetter={isStudentLetter}
        />
      ))}
    </Box>
  );
};
