import {ReactNode} from "react";

import {Identifier} from "react-admin";
import {SxProps} from "@mui/material";
import {Letter} from "@haapi/typescript-client";

export interface CreateLettersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: Identifier;
}

export interface LetterItemProps {
  letter: Letter;
  isStudentLetter?: boolean;
}

export interface BottomFieldProps {
  text: string;
  icon: ReactNode;
}

export interface ListContentStyleProps {
  isLarge: boolean;
  isSmall: boolean;
}

export interface LetterShowProps {
  isOpen: boolean;
  onToggle: () => void;
  fileUrl: string;
  filename: string;
}

export interface LetterListViewProps {
  sx?: SxProps;
  isStudentLetter: boolean;
}