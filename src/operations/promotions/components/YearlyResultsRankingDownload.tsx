import {PALETTE_COLORS} from "@/haTheme";
import {FileDownloader} from "@/operations/common/components";
import {LEVELS_CHOICES} from "@/operations/course/utils/constants";
import {StudentLevel} from "@haapi-3d601c85/typescript-client";
import {Download} from "@mui/icons-material";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useState} from "react";
import {useDataProvider} from "react-admin";

export const YearlyResultsRankingDownload = ({
  promotionId,
}: Readonly<{promotionId: string}>) => {
  const [level, setLevel] = useState<StudentLevel>(StudentLevel.L1);
  const dataProvider = useDataProvider();

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("promotions-yearly-results-export", {
      id: promotionId,
      meta: {level},
    });
    return {data: file};
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
        border: "1px solid",
        borderColor: PALETTE_COLORS.lightgrey,
        borderRadius: "8px",
        padding: "6px 10px",
      }}
    >
      <FormControl size="small" sx={{minWidth: 90}}>
        <InputLabel id="yearly-results-level-label">Niveau</InputLabel>
        <Select
          labelId="yearly-results-level-label"
          data-testid="yearly-results-level-select"
          label="Niveau"
          value={level}
          onChange={(e) => setLevel(e.target.value as StudentLevel)}
          sx={{height: "40px"}}
        >
          {LEVELS_CHOICES.map((choice) => (
            <MenuItem key={choice.id} value={choice.id}>
              {choice.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FileDownloader
        downloadFunction={downloadFile}
        fileName={`Classement des resultats annuels ${level}.xlsx`}
        startIcon={<Download />}
        buttonText="Classement et moyennes"
        successMessage="Téléchargement en cours..."
        errorMessage="Erreur lors du téléchargement du fichier."
        fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        variant="outlined"
        size="small"
        sx={{height: "40px", whiteSpace: "nowrap"}}
      />
    </Box>
  );
};
