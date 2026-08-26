import {renderMoney} from "@/operations/common/utils/money";
import {CreditTransactionDetailsDialog} from "@/operations/fees/components/Credits/CreditTransactionDetails";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {
  CreditMovement,
  CreditTransaction,
} from "@haapi-3d601c85/typescript-client";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import {Box} from "@mui/material";
import {useState} from "react";
import {FunctionField, RaRecord} from "react-admin";

interface CreditTransactionListProps {
  studentId: string;
}

export const CreditTransactionList = ({
  studentId,
}: CreditTransactionListProps) => {
  const [selected, setSelected] = useState<CreditTransaction | null>(null);

  return (
    <Box>
      <HaList
        icon={<AccountBalanceWalletOutlined />}
        title="Transactions de crédit"
        actions={null}
        resource="credits"
        filterIndicator={false}
        listProps={{
          filterDefaultValues: {
            studentId,
          },
          storeKey: `student-${studentId}-credit-transactions`,
        }}
        datagridProps={{
          rowClick: (_id: string, _resource: string, record: RaRecord) => {
            setSelected(record as CreditTransaction);
            return false;
          },
        }}
      >
        <FunctionField
          label="Mouvement"
          render={(record: CreditTransaction) => {
            if (record.movement === CreditMovement.CREDIT) {
              return "CREDIT";
            }
            if (record.movement === CreditMovement.DEBIT) {
              return "DÉBIT";
            }
            return EMPTY_TEXT;
          }}
        />
        <FunctionField
          label="Montant"
          render={(record: CreditTransaction) => renderMoney(record.amount)}
        />
        <FunctionField
          label="Date"
          render={(record: CreditTransaction) => {
            const dateTime = record.date_time;
            if (!dateTime) {
              return "Non définie";
            }
            return new Date(dateTime).toLocaleString("fr-FR");
          }}
        />
      </HaList>
      <CreditTransactionDetailsDialog
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
};
