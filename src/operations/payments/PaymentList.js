import {List} from "@react-admin/ra-rbac";
import {
  Datagrid,
  TextField,
  FunctionField,
  TopToolbar,
  CreateButton,
} from "react-admin";
import {paymentTypeRenderer} from "../utils";
import {useRole} from "../../security/hooks";
import {DeleteWithConfirm} from "../common/components";
import {renderMoney} from "../common/utils/money";
import {DateField} from "../common/components/fields";

const Actions = ({basePath, resource}) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + "/create"} resource={resource} />
  </TopToolbar>
);

const PaymentList = ({feeId}) => {
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
