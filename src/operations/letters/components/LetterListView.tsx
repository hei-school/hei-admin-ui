import {BulkActions, LetterItem} from "@/operations/letters/components";
import {useRole} from "@/security/hooks";
import {EmptyList, ResponsiveGrid} from "@/ui/components";
import {Letter} from "@haapi/typescript-client";
import {Box, CircularProgress} from "@mui/material";
import {FC, useState} from "react";
import {useListContext} from "react-admin";

export const LetterListView: FC = () => {
  const {data: letters = [], isLoading} = useListContext<Required<Letter>>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isEmpty = !letters.length;
  const {isManager, isAdmin} = useRole();

  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((letterId) => letterId !== id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const showCheckboxes = isManager() || isAdmin();

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
    <Box sx={{position: "relative"}}>
      {showCheckboxes && selectedIds.length > 0 && (
        <Box
          sx={{
            "position": "fixed",
            "bottom": "20px",
            "right": "13vw",
            "zIndex": 1000,
            "backgroundColor": "#2c2c2c",
            "color": "white",
            "borderRadius": "8px",
            "boxShadow": "0 4px 12px rgba(0, 0, 0, 0.15)",
            "padding": "8px 16px",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "gap": "10px",
            "animation": "slideUp 0.3s ease-out",
            "@keyframes slideUp": {
              from: {transform: "translateY(20px)", opacity: 0},
              to: {transform: "translateY(0)", opacity: 1},
            },
          }}
        >
          <Box sx={{display: "flex", alignItems: "center", mr: 2}}>
            <Box
              sx={{
                backgroundColor: "#4caf50",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            {selectedIds.length} {selectedIds.length > 1 ? "items" : "item"}{" "}
            sélectionné{selectedIds.length > 1 ? "s" : ""}
          </Box>
          <BulkActions
            selectedIds={selectedIds}
            onClearSelection={handleClearSelection}
          />
        </Box>
      )}
      <ResponsiveGrid>
        {isEmpty && <EmptyList />}
        {letters.map((letter) => (
          <LetterItem
            key={letter.id}
            letter={letter}
            showCheckbox={showCheckboxes && letter.status === "PENDING"}
            selected={selectedIds.includes(letter.id!)}
            onSelect={handleSelect}
          />
        ))}
      </ResponsiveGrid>
    </Box>
  );
};
