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

export interface LetterShowProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  filename: string;
}

export interface LetterListViewProps {
  sx?: SxProps;
  isStudentLetter: boolean;
}

export interface PopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}
