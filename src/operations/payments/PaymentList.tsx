import {DeleteWithConfirm} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {PaymentStatusIcon} from "@/operations/payments/components/PaymentStatusIcon";
import {GetReceipt} from "@/operations/students/components";
import {paymentTypeRenderer} from "@/operations/utils/index";
import {useRole} from "@/security/hooks/index";
import {Payment} from "@haapi-b0fc7615/typescript-client";
import {List} from "@react-admin/ra-rbac";
import {
  CreateButton,
  Datagrid,
  FunctionField,
  TextField,
  TopToolbar,
} from "react-admin";

interface ActionsProps {
  basePath: string;
  resource?: string;
}

const Actions = ({basePath, resource}: Readonly<ActionsProps>) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + "/create"} resource={resource} />
  </TopToolbar>
);

interface PaymentListProps {
  feeId: string;
  studentId: string;
}

const PaymentList = ({feeId, studentId}: Readonly<PaymentListProps>) => {
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
          render={(record: Payment) =>
            paymentTypeRenderer(record.type)?.name || "-"
          }
        />
        <FunctionField
          label="Montant"
          render={(record: Payment) => renderMoney(record.amount)}
          textAlign="right"
        />
        <FunctionField
          label="Statut"
          render={() => <PaymentStatusIcon />}
          textAlign="center"
        />
        <FunctionField
          label="Reçu"
          render={(record: Payment & {id: string}) => (
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
