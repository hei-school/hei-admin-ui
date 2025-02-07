import {
  ArrowBackIos,
  ArrowForwardIos,
  Download,
  Upload,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  useWizardFormContext,
  WizardForm,
  WizardFormStep,
} from "@react-admin/ra-form-layout";
import {useRef} from "react";
import {useNotify} from "react-admin";
import {useForm} from "react-hook-form";
import {exportData} from "../../../operations/utils";
import useHaListContext from "../../haList/useHaListContext";
import {ImportInputFile} from "./ImportInputFile";

const WizardToolbar = () => {
  const {hasNextStep, hasPreviousStep, goToNextStep, goToPreviousStep} =
    useWizardFormContext();
  return (
    <div style={{display: "flex", justifyContent: "space-around"}}>
      {hasPreviousStep && (
        <Button
          onClick={() => goToPreviousStep()}
          startIcon={<ArrowBackIos />}
          style={{display: "flex", justifySelf: "start"}}
          variant="contained"
          size="small"
        >
          Retour
        </Button>
      )}
      {hasNextStep && (
        <Button
          onClick={() => goToNextStep()}
          endIcon={<ArrowForwardIos />}
          style={{display: "flex", justifySelf: "end"}}
          variant="contained"
          size="small"
        >
          Suivant
        </Button>
      )}
    </div>
  );
};

export function ImportDialog({
  optionalHeaders,
  minimalHeaders,
  validateData,
  provider,
  transformData,
  isOpen,
  toggle,
  resource,
}) {
  const {closeAction} = useHaListContext();
  const notify = useNotify();
  const inputRef = useRef(null);
  const headers = minimalHeaders.map((header) => header.value);
  const {register, handleSubmit} = useForm({
    fileName: "template",
    importHeaders: headers,
  });

  const downloadFile = (data) => {
    exportData([], data?.importHeaders, data.fileName);
  };

  const doImport = async (data) => {
    const importValidate = validateData(data);
    if (importValidate.isValid) {
      const modifiedData = transformData ? transformData(data) : data;
      await provider(modifiedData).then(() =>
        notify(`Importation effectuée avec succès`, {
          type: "success",
          autoHideDuration: 1000,
        })
      );
    } else {
      notify(importValidate.message, {type: "error", autoHideDuration: 3000});
    }
  };

  const closeDialog = () => {
    closeAction();
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogTitle>Importer des {resource} en 3 étapes</DialogTitle>
      <DialogContent>
        <WizardForm toolbar={<WizardToolbar />}>
          <WizardFormStep label="Fichier">
            <Grid container padding={3} rowSpacing={5}>
              <Typography variant="body2">
                Vous pouvez choisir le nom de votre template. Par défaut, ce
                sera <strong>template.xlsx</strong>
              </Typography>
              <TextField
                label="Nom de votre template"
                variant="filled"
                defaultValue="template"
                fullWidth
                {...register("fileName", {})}
              />
            </Grid>
          </WizardFormStep>
          <WizardFormStep label="En-têtes">
            <Grid container padding={3} rowSpacing={2}>
              <Grid item>
                <Typography variant="body2">
                  Vous pouvez aussi personnaliser les en-têtes. Les en-têtes
                  déjà cochées sont obligatoires.
                  <br />
                  Il ne vous restera plus qu'à appuyez sur le bouton{" "}
                  <strong>TÉLÉCHARGER</strong> et modifier votre template.
                </Typography>
              </Grid>
              <Grid item>
                <FormGroup>
                  {minimalHeaders.map((head) => (
                    <FormControlLabel
                      key={head.id}
                      control={
                        <Checkbox
                          size="small"
                          readOnly={head.disabled}
                          checked
                          {...register("importHeaders", {})}
                        />
                      }
                      value={head.value}
                      label={
                        <Typography variant="body2">{head.label}</Typography>
                      }
                    />
                  ))}
                  {optionalHeaders.map((head) => (
                    <FormControlLabel
                      key={head.id}
                      control={
                        <Checkbox
                          size="small"
                          {...register("importHeaders", {})}
                        />
                      }
                      value={head.value}
                      label={
                        <Typography variant="body2">{head.label}</Typography>
                      }
                    />
                  ))}
                </FormGroup>
                <Button
                  onClick={handleSubmit(downloadFile)}
                  startIcon={<Download />}
                  size="medium"
                  variant="outlined"
                >
                  Télécharger
                </Button>
              </Grid>
            </Grid>
          </WizardFormStep>
          <WizardFormStep label="Importation">
            <Grid container padding={3} rowSpacing={5}>
              <Grid item>
                <Typography variant="body2">
                  Ça y est? Après avoir vérifié votre fichier, appuyez sur le
                  bouton <strong>IMPORTER</strong> et voilà ! 😁
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  size="medium"
                  variant="outlined"
                  onClick={() => inputRef.current.click()}
                  startIcon={<Upload />}
                >
                  <ImportInputFile ref={inputRef} mutationRequest={doImport} />
                  <span>Importer</span>
                </Button>
              </Grid>
            </Grid>
          </WizardFormStep>
        </WizardForm>
      </DialogContent>
    </Dialog>
  );
}
