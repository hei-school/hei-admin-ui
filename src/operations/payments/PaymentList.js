import { List } from "@react-admin/ra-rbac";
import {
  Datagrid,
  TextField,
  FunctionField,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { prettyPrintMoney, paymentTypeRenderer, CustomDateField } from "../utils";
import { useRole } from "../../security/hooks";
import { DeleteButton } from "../common/components";

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + "/create"} resource={resource} />
  </TopToolbar>
);

const PaymentList = ({ feeId }) => {
  const role = useRole();
  return (
    <List
      title=" " // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
      resource={"payments"}
      actions={
        role.isManager() && (
          <Actions basePath={`/fees/${feeId}/payments`} />
        )
      }
      filterDefaultValues={{ feeId: feeId }}
      pagination={false}
    >
      <Datagrid bulkActionButtons={false}>
        <CustomDateField
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
          render={(record) => prettyPrintMoney(record.amount)}
          textAlign="right"
        />
        {role.isManager() && <DeleteButton />}
      </Datagrid>
    </List>
  );
};

export default PaymentList;
