import {FC} from "react";
import {useListContext} from "react-admin";
import {SxProps, Box} from "@mui/material";
import {Letter} from "@haapi/typescript-client";
import Emptylist from "@/operations/letters/components/Emptylist";
import LetterItem from "@/operations/letters/components/LetterItems";

interface LettersContentProps {
  sx?: SxProps;
  isStudentLetters: boolean;
}

const LettersContent: FC<LettersContentProps> = ({sx, isStudentLetters}) => {
  const {data: letters = []} = useListContext<Required<Letter>>();
  const isEmpty = letters.length === 0;

  return (
    <Box sx={sx}>
      {isEmpty && <Emptylist />}
      {letters.map((letter) => (
        <LetterItem
          key={letter.id}
          letter={letter}
          isStudentLetters={isStudentLetters}
        />
      ))}
    </Box>
  );
};

export default LettersContent;
