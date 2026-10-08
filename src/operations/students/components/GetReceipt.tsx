import {FileDownloader} from "@/operations/common/components";
import {feeIdFromRaId} from "@/providers/feeProvider";
import {Download} from "@mui/icons-material";
import {Identifier, useDataProvider} from "react-admin";

const FILE_NAME = "Reçu_paiement.pdf";

interface Receipt {
  id: Identifier;
  file: ArrayBuffer;
}

export type GetReceiptProps = {
  studentId: string;
  feeId: string;
  paymentId: string;
};

export const GetReceipt = ({
  studentId,
  feeId,
  paymentId,
}: Readonly<GetReceiptProps>) => {
  const formattedFeeId = feeIdFromRaId(feeId);
  const dataProvider = useDataProvider();
  const downloadReceipt = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne<Receipt>("receipts", {
      id: studentId,
      meta: {formattedFeeId, paymentId},
    });
    return {data: file};
  };
  return (
    <FileDownloader
      downloadFunction={downloadReceipt}
      fileName={FILE_NAME}
      buttonText="Reçu"
      startIcon={<Download />}
      data-testid="get-receipt-btn"
      successMessage="Reçu en cours de téléchargement"
      errorMessage="Échec de téléchargement. Veuillez réessayer"
    />
  );
};
