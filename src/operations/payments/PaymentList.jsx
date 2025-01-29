import {DeleteWithConfirm} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {GetReceipt} from "@/operations/students/components";
import {paymentTypeRenderer} from "@/operations/utils/index";
import {useRole} from "@/security/hooks/index";
import {List} from "@react-admin/ra-rbac";
import {
  CreateButton,
  Datagrid,
  FunctionField,
  TextField,
  TopToolbar,
} from "react-admin";
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
        (role.isManager() || role.isAdmin()) && (
          <Actions basePath={`/fees/${feeId}/payments`} />
        )
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
          render={(record) => (
            <GetReceipt
              studentId={studentId}
              feeId={feeId}
              paymentId={record.id}
            />
          )}
          textAlign="right"
        />

        {(role.isManager() || role.isAdmin()) && (
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
