import {renderMoney} from "@/operations/common/utils/money";
import {HaList} from "@/ui/haList/HaList";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import {Box} from "@mui/material";
import {FunctionField} from "react-admin";

interface CreditTransactionListProps {
  studentId: string;
}

export const CreditTransactionList = ({
  studentId,
}: CreditTransactionListProps) => {
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
      >
        <FunctionField
          label="Mouvement"
          render={(record) => {
            if (record.movement === "DEPOSIT") {
              return "Dépôt";
            }
            if (record.movement === "WITHDRAWAL") {
              return "Retrait";
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
    </Box>
  );
};
