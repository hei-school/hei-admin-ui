import {ListMenu, ListMenuItem} from "@/ui/haLayout/menu/utils";
import {
  AttachMoney as FeesIcon,
  School as StudentIcon,
  People as StudentListIcon,
  CurrencyExchange as TransactionsIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";

const ManagerMenuFeesOnly = () => {
  return (
    <Box>
      <ListMenu label="Étudiants" icon={<StudentIcon />}>
        <ListMenuItem
          label="Liste des étudiants"
          icon={<StudentListIcon />}
          to="/students"
        />
        <ListMenuItem
          label="Transactions (Mobile Money)"
          icon={<TransactionsIcon />}
          to="/transactions"
        />
        <ListMenuItem
          label="Frais (en retard par défaut)"
          icon={<FeesIcon />}
          to="/fees"
        />
      </ListMenu>
    </Box>
  );
}

export default ManagerMenuFeesOnly;
