import {LetterItem} from "@/operations/letters/components/LetterItem";
import {EmptyList} from "@/ui/components";
import {Letter} from "@haapi/typescript-client";
import {Box, CircularProgress, useMediaQuery} from "@mui/material";
import {FC} from "react";
import {useListContext} from "react-admin";

export const LetterListView: FC = () => {
  const {data: letters = [], isLoading} = useListContext<Required<Letter>>();
  const isEmpty = !letters.length;
  const isSmall = useMediaQuery("(max-width:900px)");
  const isLarge = useMediaQuery("(min-width:1700px)");

  if (isLoading) {
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
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        gap: isLarge ? "1.1rem" : "1rem",
        paddingLeft: isLarge ? "1.2rem" : isSmall ? "1rem" : "0.85rem",
        justifyContent: "flex-start",
        marginTop: "2rem",
      }}
      data-testid="letter-list-wrapper"
    >
      {isEmpty && <EmptyList />}
      {letters.map((letter) => (
        <LetterItem key={letter.id} letter={letter} />
      ))}
    </Box>
  );
};
