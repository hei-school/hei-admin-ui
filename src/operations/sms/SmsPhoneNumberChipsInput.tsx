import {Backspace, Check} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
} from "@mui/material";
import {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import {FieldTitle, useInput, Validator} from "react-admin";

const VALID_PHONE_PREFIXES = new Set([
  "032",
  "033",
  "034",
  "035",
  "037",
  "038",
]);

const isValidPhoneNumber = (value: string) =>
  /^\d{10}$/.test(value) && VALID_PHONE_PREFIXES.has(value.slice(0, 3));

const PHONE_NUMBER_HINT =
  "10 chiffres commençant par 032, 033, 034, 035, 037 ou 038";

const KEYPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "validate",
  "0",
  "backspace",
];

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
  const [draftError, setDraftError] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const phoneNumbers: string[] = field.value ?? [];

  const commitTokens = (tokens: string[]): boolean => {
    const invalidToken = tokens.find((token) => !isValidPhoneNumber(token));
    if (invalidToken) {
      setDraft(invalidToken);
      setDraftError(PHONE_NUMBER_HINT);
      return false;
    }
    if (tokens.length === 0) return true;
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
    setDraftError(null);
    return true;
  };

  const removeNumber = (index: number) => {
    field.onChange(phoneNumbers.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraft("");
      setDraftError(null);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setDraft(phoneNumbers[index]);
    setDraftError(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      if (commitTokens([trimmed])) setDraft("");
    } else if (editingIndex !== null) {
      removeNumber(editingIndex);
      setDraftError(null);
    } else {
      setDraftError(null);
    }
  };

  const applyDraftValue = (rawValue: string) => {
    const sanitized = rawValue.replace(/[^\d ]/g, "");
    const parts = sanitized.split(" ");
    const draftPart = parts.pop() ?? "";
    const tokens = parts.map((part) => part.trim()).filter(Boolean);
    if (tokens.length > 0) {
      if (commitTokens(tokens)) setDraft(draftPart);
    } else {
      setDraft(draftPart);
      setDraftError(null);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyDraftValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    }
  };

  const handleKeypadPress = (key: string) => {
    if (key === "backspace") {
      applyDraftValue(draft.slice(0, -1));
      return;
    }
    if (key === "validate") {
      commitDraft();
      return;
    }
    applyDraftValue(draft + key);
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
        error={!!fieldState.error || !!draftError}
        helperText={
          draftError ??
          fieldState.error?.message ??
          `Tapez un numéro puis Espace ou Entrée pour le valider (${PHONE_NUMBER_HINT})`
        }
        inputProps={{
          "data-testid": `sms-phone-number-input-${source}`,
          "inputMode": "numeric",
        }}
      />
      <FormControlLabel
        sx={{mt: 0.5}}
        control={
          <Checkbox
            size="small"
            checked={showKeypad}
            onChange={(event) => setShowKeypad(event.target.checked)}
            data-testid={`sms-phone-keypad-toggle-${source}`}
          />
        }
        label="Afficher un clavier numérique"
      />
      {showKeypad && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            maxWidth: 260,
            mt: 1,
          }}
          data-testid={`sms-phone-keypad-${source}`}
        >
          {KEYPAD_KEYS.map((key) => {
            if (key === "backspace") {
              return (
                <Button
                  key="keypad-backspace"
                  variant="outlined"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleKeypadPress(key)}
                  data-testid={`sms-phone-keypad-backspace-${source}`}
                >
                  <Backspace fontSize="small" />
                </Button>
              );
            }
            if (key === "validate") {
              return (
                <Button
                  key="keypad-validate"
                  variant="outlined"
                  color="primary"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleKeypadPress(key)}
                  data-testid={`sms-phone-keypad-validate-${source}`}
                >
                  <Check fontSize="small" />
                </Button>
              );
            }
            return (
              <Button
                key={`keypad-${key}`}
                variant="outlined"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleKeypadPress(key)}
                data-testid={`sms-phone-keypad-digit-${source}-${key}`}
              >
                {key}
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
