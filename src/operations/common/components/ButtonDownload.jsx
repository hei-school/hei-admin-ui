import { Button } from "react-admin";
import ReceiptIcon from '@mui/icons-material/Receipt';
import { GetReceipt } from "@/operations/students/components/GetReceipt";
import { filesApi, payingApi } from "@/providers/api";
import { FileDownloader } from "./FileDownloader";
import GetCertificate from "@/operations/students/components/GetCertificate";

 const ButtonDownload = ({studentId, feeId}) => {
    return(
      <Button
        label={<GetCertificate studentId={id} />}
        data-testid="get-certificate-btn"
        {...COMMON_OUTLINED_BUTTON_PROPS}
      >
        <Download />
      </Button>
    );
}
export default ReceiptButton

