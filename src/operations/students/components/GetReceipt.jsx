import {Button, useDataProvider, useGetOne} from "react-admin";
import {Download} from "@mui/icons-material";
import {FileDownloader} from "@/operations/common/components";
import {payingApi} from "@/providers/api";
import {feeIdFromRaId} from "@/providers/feeProvider";
import receiptProvider from "@/providers/receiptProvider";

const FILE_NAME = "Reçu_paiement.pdf";

export const GetReceipt = ({studentId, feeId, paymentId}) => {
  const formattedFeeId = feeIdFromRaId(feeId);
  const dataProvider = useDataProvider();

  const downloadReceipt = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("receipts", {
      id: studentId,
      meta: {formattedFeeId, paymentId},
    });
    return {data: file};
  };

  return (
    <FileDownloader
      downloadFunction={downloadReceipt}
      fileName={FILE_NAME}
      buttonText={
        <Button
          label="Reçu"
          startIcon={<Download />}
          data-testid="get-receipt-btn"
        />
      }
      successMessage="Reçu en cours de téléchargement"
      errorMessage="Échec de téléchargement. Veuillez réessayer"
    />
  );
};
