import {FC} from "react";
import {useListContext} from "react-admin";
import {Box} from "@mui/material";
import {Letter} from "@haapi/typescript-client";
import LetterItem from "@/operations/letters/components/LetterItem";
import EmptyLetterList from "./EmptyLetterList";
import {LetterListViewProps} from "@/operations/letters/types";

const LetterListView: FC<LetterListViewProps> = ({sx, isStudentLetter}) => {
  const {data: letters = []} = useListContext<Required<Letter>>();
  const isEmpty = !letters.length;

  return (
    <Box sx={sx}>
      {isEmpty && <EmptyLetterList />}
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

export default LetterListView;
