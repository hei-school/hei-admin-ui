import {ReactNode} from "react";

import {Identifier} from "react-admin";
import {Letter} from "@haapi/typescript-client";

export interface CreateLettersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: Identifier;
  feeId?: Identifier;
  feeAmount?: number;
  title?: string;
  eventParticipantId?: string;
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

export interface PopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  letterId: string;
}
