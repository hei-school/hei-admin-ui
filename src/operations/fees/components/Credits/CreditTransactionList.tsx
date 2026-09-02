import {renderMoney} from "@/operations/common/utils/money";
import {HaList} from "@/ui/haList/HaList";
import {CreditTransaction} from "@haapi-3d601c85/typescript-client";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import {Box} from "@mui/material";
import {useState} from "react";
import {FunctionField, Identifier, RaRecord} from "react-admin";
import {CreditTransactionDetailsDialog} from "./CreditTransactionDetailsDialog";

interface CreditTransactionListProps {
  studentId: string;
}

export const CreditTransactionList = ({
  studentId,
}: CreditTransactionListProps) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<CreditTransaction | null>(null);
  return (
    <Box>
      <HaList
        icon={<AccountBalanceWalletOutlined />}
        title="Transactions de crédit"
        actions={null}
        resource="credits"
        filterIndicator={false}
        datagridProps={{
          rowClick: (_id: Identifier, _resource: string, record: RaRecord) => {
            setSelectedTransaction(record as CreditTransaction);
            return false;
          },
        }}
        listProps={{
          filterDefaultValues: {
            studentId,
          },
          storeKey: `student-${studentId}-credit-transactions`,
        }}
      >
        <FunctionField
          label="Mouvement"
          render={(record) => {
            if (record.movement === "CREDIT") {
              return "Crédit";
            }
            if (record.movement === "DEBIT") {
              return "Débit";
            }
            return "Non défini";
          }}
        />
        <FunctionField
          label="Montant"
          render={(record) => renderMoney(record.amount)}
        />
        <FunctionField
          label="Date"
          render={(record) => {
            const dateTime = record.date_time ?? record.creation_datetime;
            if (!dateTime) {
              return "Non définie";
            }
            return new Date(dateTime).toLocaleString("fr-FR");
          }}
        />
      </HaList>
      {selectedTransaction && (
        <CreditTransactionDetailsDialog
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </Box>
  );
};
