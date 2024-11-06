import {
  FunctionField,
  ShowButton,
  TextField,
  useGetOne,
  useList,
  useListContext,
} from "react-admin";
import {Box} from "@mui/material";
import {AttachMoney, Cancel, Pending, Check} from "@mui/icons-material";
import {FeeStatusEnum} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList/HaList";
import {FeesFilters} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {rowStyle} from "./utils";
import {NOOP_ID} from "@/utils/constants";
import {ListHeader} from "../common/components";

const ByStatusFeeList = (props) => {
  const {
    data: stats = {
      total_fees: "...",
      paid_fees: "...",
      unpaid_fees: "...",
    },
  } = useGetOne("stats", {id: NOOP_ID, meta: {resource: "fees"}});

  const headerCardContent = [
    {
      title: "Total",
      icon: <AttachMoney fontSize="medium" />,
      total: stats.total_fees,
    },
    {
      title: "Non-payés",
      icon: <Pending fontSize="medium" />,
      total: stats.unpaid_fees,
    },
    {
      title: "Payés",
      icon: <Check fontSize="medium" />,
      total: stats.paid_fees,
    },
    {
      title: "En retard",
      icon: <Cancel fontSize="medium" />,
      total:
        stats.total_fees == "..."
          ? "..."
          : stats.total_fees - (stats.paid_fees + stats.unpaid_fees),
    },
  ];

  return (
    <Box>
      <ListHeader
        cardContents={headerCardContent}
        title="Liste des frais (en retard par défaut)"
      />
      <HaList
        {...props}
        title=" "
        resource="fees"
        listProps={{
          filterDefaultValues: {status: FeeStatusEnum.LATE},
          storeKey: "latefees",
        }}
        actions={<FeesFilters />}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        filterIndicator={false}
        datagridProps={{
          rowClick: (id) => `/fees/${id}/show`,
          rowStyle,
        }}
      >
        <TextField source="student_ref" label="Référence de l'étudiant" />
        <DateField source="due_datetime" label="Date limite" showTime={false} />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />
        <FunctionField
          label="Reste à payer"
          render={(fee) => renderMoney(fee.remaining_amount)}
        />
        <DateField
          source="creation_datetime"
          label="Date de création"
          showTime={false}
        />
        <ShowButton basePath="/fees" />
      </HaList>
    </Box>
  );
};

export default ByStatusFeeList;
