import {Box, Chip, TextField} from "@mui/material";
import {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import {FieldTitle, useInput, Validator} from "react-admin";

interface SmsPhoneNumberChipsInputProps {
  source: string;
  label: string;
  validate?: Validator | Validator[];
}

export const SmsPhoneNumberChipsInput = ({
  source,
  label,
  validate,
}: SmsPhoneNumberChipsInputProps) => {
  const {field, fieldState, isRequired} = useInput({
    source,
    validate,
    defaultValue: [],
  });
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phoneNumbers: string[] = field.value ?? [];

  const commitTokens = (tokens: string[]) => {
    if (tokens.length === 0) return;
    let next = [...phoneNumbers];
    let replaceIndex = editingIndex;
    tokens.forEach((token) => {
      if (replaceIndex !== null) {
        next[replaceIndex] = token;
        replaceIndex = null;
      } else {
        next = [...next, token];
      }
    });
    field.onChange(next);
    setEditingIndex(null);
  };

  const removeNumber = (index: number) => {
    field.onChange(phoneNumbers.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraft("");
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setDraft(phoneNumbers[index]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      commitTokens([trimmed]);
    } else if (editingIndex !== null) {
      removeNumber(editingIndex);
    }
    setDraft("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parts = event.target.value.split(" ");
    const draftPart = parts.pop() ?? "";
    const tokens = parts.map((part) => part.trim()).filter(Boolean);
    if (tokens.length > 0) commitTokens(tokens);
    setDraft(draftPart);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    }
  };

  return (
    <Box sx={{width: "100%"}}>
      {phoneNumbers.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 1.5,
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {phoneNumbers.map(
            (number, index) =>
              index !== editingIndex && (
                <Chip
                  key={`${number}-${index}`}
                  size="small"
                  label={number}
                  onClick={() => startEditing(index)}
                  onDelete={() => removeNumber(index)}
                  data-testid={`sms-phone-chip-${index}`}
                />
              )
          )}
        </Box>
      )}
      <TextField
        inputRef={inputRef}
        fullWidth
        size="small"
        label={
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        }
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        error={!!fieldState.error}
        helperText={
          fieldState.error?.message ??
          "Tapez un numéro puis Espace ou Entrée pour le valider"
        }
        inputProps={{"data-testid": `sms-phone-number-input-${source}`}}
      />
    </Box>
  );
};
