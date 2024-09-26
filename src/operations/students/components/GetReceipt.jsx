import {FileDownloader} from "@/operations/common/components";
import {payingApi} from "@/providers/api";
import {feeIdFromRaId} from "@/providers/feeProvider";
import receiptProvider from "@/providers/receiptProvider";
import {useGetOne} from "react-admin";

const FILE_NAME = "Reçu_paiement.pdf";

export const GetReceipt = ({studentId, feeId, paymentId}) => {
  const formattedFeeId = feeIdFromRaId(feeId);
  const {data, error, isLoading} = useGetOne("receipts", {
    id: studentId,
    meta: {formattedFeeId, paymentId},
  });

  const downloadReceipt = async () => {
    if (error) {
      console.error("Erreur lors du téléchargement du reçu :", error);
      throw new Error("Échec du téléchargement du reçu.");
    }
    if (!data || !data.data) {
      throw new Error("Aucun fichier PDF trouvé.");
    }

    const blob = new Blob([data.data], {type: "application/pdf"});
    return {data: blob};
  };
  return (
    <FileDownloader
      downloadFunction={downloadReceipt}
      fileName={FILE_NAME}
      buttonText="Reçu"
      successMessage="Reçu en cours de téléchargement"
      errorMessage="Échec de téléchargement. Veuillez réessayer"
    />
  );
};
