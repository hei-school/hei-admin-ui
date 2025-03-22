import {ReactNode} from "react";

import {Letter} from "@haapi/typescript-client";
import {Identifier} from "react-admin";

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
  onSelect?: (id: string, selected: boolean) => void;
  selected?: boolean;
  showCheckbox?: boolean;
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
