import {ComplaintType, Manager} from "@haapi-3d601c85/typescript-client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {useCreate, useGetOne, useNotify} from "react-admin";
import {COMPLAINT_TYPE_CHOICES} from "../utils/constants";
import {ManagerAutocompleteInput} from "./ManagerAutocompleteInput";

export const ComplaintRoutingForm = ({
  onSuccess,
}: Readonly<{onSuccess?: () => void}>) => {
  const notify = useNotify();
  const [type, setType] = useState<ComplaintType>(ComplaintType.ACADEMIC);
  const [manager, setManager] = useState<Manager | null>(null);
  const {
    data: routing,
    isLoading: isRoutingLoading,
    refetch,
  } = useGetOne("complaint-routings", {id: type});
  const [create, {isLoading: isAssigning}] = useCreate();

  const currentManagerName = routing?.manager
    ? `${routing.manager.first_name ?? ""} ${routing.manager.last_name ?? ""}`.trim()
    : "Aucun responsable assigné";

  const handleAssign = () => {
    if (!manager?.id) return;
    void create(
      "complaint-routings",
      {data: {type, manager_id: manager.id}},
      {
        onSuccess: () => {
          notify("Manager assigné avec succès.", {type: "success"});
          setManager(null);
          void refetch();
          onSuccess?.();
        },
        onError: () => {
          notify("Une erreur est survenue. Merci de réessayer.", {
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Box sx={{p: 2}}>
      <FormControl fullWidth sx={{mb: 2}}>
        <InputLabel id="complaint-routing-type-label">
          Type de réclamation
        </InputLabel>
        <Select
          labelId="complaint-routing-type-label"
          label="Type de réclamation"
          data-testid="complaint-routing-type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as ComplaintType);
            setManager(null);
          }}
        >
          {COMPLAINT_TYPE_CHOICES.map((choice) => (
            <MenuItem key={choice.id} value={choice.id}>
              {choice.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
        Responsable actuel :{" "}
        {isRoutingLoading ? "Chargement..." : currentManagerName}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{flex: 1}}>
          <ManagerAutocompleteInput
            value={manager}
            onChange={setManager}
            label="Rechercher un manager"
          />
        </Box>
        <Button
          data-testid="assign-manager"
          variant="contained"
          disabled={!manager || isAssigning}
          onClick={handleAssign}
        >
          Assigner
        </Button>
      </Stack>
    </Box>
  );
};
