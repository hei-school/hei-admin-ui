import {List} from "@react-admin/ra-rbac";
import {
  Datagrid,
  TextField,
  FunctionField,
  TopToolbar,
  CreateButton,
  Button
} from "react-admin";
import {Download} from "@mui/icons-material";
import {paymentTypeRenderer} from "@/operations/utils/index";
import {useRole} from "@/security/hooks/index";
import {DeleteWithConfirm} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import GetReceipt from "@/operations/students/components/GetReceipt";
import { COMMON_OUTLINED_BUTTON_PROPS } from "@/ui/constants/common_styles";
const Actions = ({basePath, resource}) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + "/create"} resource={resource} />
  </TopToolbar>
);

const PaymentList = ({feeId, studentId}) => {
  const role = useRole();
  return (

    <List
      title=" " // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
      resource={"payments"}
      actions={
        role.isManager() && <Actions basePath={`/fees/${feeId}/payments`} />
      }
      filterDefaultValues={{feeId: feeId}}
      pagination={false}
    >
      <Datagrid bulkActionButtons={false}>
        <DateField
          source="creation_datetime"
          label="Date de création"
          showTime={false}
        />
        <TextField source="comment" label="Commentaire" />
        <FunctionField
          label="Type"
          render={(record) => paymentTypeRenderer(record.type)?.name || "-"}
        />
        <FunctionField
          label="Montant"
          render={(record) => renderMoney(record.amount)}
          textAlign="right"
        />
        <FunctionField
          label="Reçu"
          render={() => (
            <Button
            label={<GetReceipt studentId={studentId} feeId={feeId} />}
            size="small"
            data-testid="get-receipt-btn"
            startIcon={<Download />}
            >
              reçu
            </Button>
          )}
          textAlign="right"
        />
        
        {role.isManager() && (
          <DeleteWithConfirm
            resourceType="payments"
            confirmTitle="Suppression du paiement"
            confirmContent="Confirmez-vous la suppression de ce paiement ?"
          />
        )}
      </Datagrid>
    </List>
  );
};

export default PaymentList;
