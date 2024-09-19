import { FileDownloader } from "@/operations/common/components/FileDownloader";
import { payingApi } from "@/providers/api";
import { feeIdFromRaId } from "@/providers/feeProvider";

const FILE_NAME = "Reçu_paiement.pdf";

export default function GetReceipt({ studentId, feeId }) {
  const formattedFeeId = feeIdFromRaId(feeId);
  const downloadFunction = () => 
    payingApi().getPaidFeeReceipt(studentId, formattedFeeId, { responseType: "arraybuffer" });

  return (
    <FileDownloader
      downloadFunction={downloadFunction}
      fileName={FILE_NAME}
      buttonText="Reçu"
      successMessage="Reçu en cours de téléchargement"
      errorMessage="Échec de téléchargement. Veuillez réessayer"
    />
  );
}