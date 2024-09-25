import React from 'react'; 
import {FunctionField, TextField} from "react-admin"; 
import {WarningOutlined} from "@mui/icons-material"; 
import {Box, Chip} from "@mui/material"; 
import {HaList} from "@/ui/haList/HaList";
import {EMPTY_TEXT} from "@/ui/constants";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money"; 
import {commentFunctionRenderer} from "@/operations/utils";
import {FeesFilter} from "@/operations/fees/components/FeesFilter";
import {rowStyle, PSP_COLORS, PSP_VALUES} from "@/operations/fees/utils";

export const MonitorFeeList = ({ studentId, studentRef }) => {
  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource="fees"
      filterIndicator={false}
      actions={<MonitorFeesActions studentId={studentId} />}
      listProps={{
        filterDefaultValues: { studentId },
        storeKey: "fees",
      }}
      datagridProps={{
        rowClick: (id) => `/fees/${id}/show`,
        rowStyle,
        rowProps: (record) => ({
          "data-testid": `fee-row-${record.id}`,
        }),
      }}
      editable={false}
    >
      <DateField
        source="due_datetime"
        label="Date limite de paiement"
        showTime={false}
      />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
      />
      <TextField
        source="mpbs.psp_id"
        label="Référence de transaction"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) =>
          fee.mpbs ? (
            <Chip
              color={PSP_COLORS[fee.mpbs?.psp_type]}
              label={PSP_VALUES[fee.mpbs?.psp_type]}
            />
          ) : (
            EMPTY_TEXT
          )
        }
        label="Type de transaction"
        emptyText={EMPTY_TEXT}
      />
      <DateField
        source="mpbs.creation_datetime"
        label="Ajout de la référence"
        showTime
      />
      <DateField
        source="mpbs.last_datetime_verification"
        label="Dernière vérification"
        showTime
      />
      <DateField
        source="mpbs.psp_own_datetime_verification"
        label="Vérification par le PSP"
        showTime
      />
      <DateField
        source="mpbs.successfully_verified_on"
        label="Vérification réussie"
        showTime
      />
    </HaList>
  );
};

function MonitorFeesActions({ studentId }) {
  return <FeesFilter studentId={studentId} />;
}
