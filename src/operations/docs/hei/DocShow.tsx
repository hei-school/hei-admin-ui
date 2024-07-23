import {FC, useEffect, useState} from "react";
import {Link, Button} from "react-admin";
import {v4 as uuidv4} from "uuid";
import {PALETTE_COLORS} from "@/haTheme";
import {
  Box,
  Card,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {ShareInfo} from "@haapi/typescript-client";
import dataProvider from "@/providers/dataProvider";

interface DocShowProps {
  open: boolean;
  onClose: () => void;
}
export const DocShow: FC<DocShowProps> = ({open, onClose}) => {
  const [password, setPassword] = useState(uuidv4());
  const [file, setFile] = useState<ShareInfo>();

  useEffect(() => {
    const doEffect = async () => {
      setPassword(uuidv4());
      const {data: file} = await dataProvider.getOne("hei-docs", {
        id: "id",
        meta: {password},
      });
      setFile(file);
    };
    doEffect();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{bgcolor: PALETTE_COLORS.yellow, height: 25}}
      ></DialogTitle>
      <DialogContent>
        <Box p={3}>
          <Typography variant="h5" m="auto">
            Vos documents HEI désormais accessibles sur OwnCloud !
          </Typography>
          <Divider sx={{mt: 2, mb: 1, bgcolor: PALETTE_COLORS.yellow}} />
          <Typography>
            Vos documents sont en sécurité et accessibles où que vous soyez.
            <br /> Accédez-y dès maintenant :
            <Card sx={{bgcolor: PALETTE_COLORS.lightgrey, p: 1, my: 2}}>
              {file ? (
                <ul>
                  <li>
                    <Typography>
                      <strong>Lien : </strong>
                      <Link to={file.url ?? "Pas de lien"} target="_blank">
                        {file.url ?? "Pas de lien"}
                      </Link>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      <strong>Mot de passe :</strong>{" "}
                      {file.password ?? "Pas de mot de passe"}{" "}
                    </Typography>
                  </li>
                </ul>
              ) : (
                <Typography color="red">
                  Nous n'arrivons pas à obtenir les informations sur le dossier.
                </Typography>
              )}
            </Card>
            <Typography variant="body2" color="red" textAlign="right">
              * Attention : Ce lien expirera dans 24 heures.
            </Typography>
          </Typography>
        </Box>
        <DialogActions>
          <Button
            label="J'ai compris"
            size="medium"
            onClick={onClose}
            variant="contained"
            style={{
              backgroundColor: PALETTE_COLORS.primary,
              color: PALETTE_COLORS.white,
              marginTop: "15px",
              marginLeft: "5px",
            }}
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
