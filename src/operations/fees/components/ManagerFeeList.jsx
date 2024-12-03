import {FunctionField, TextField} from "react-admin";
import {WarningOutlined} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {DeleteWithConfirm} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {commentFunctionRenderer} from "@/operations/utils";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "@/operations/fees/importConf";
import {rowStyle, PSP_COLORS, PSP_VALUES} from "@/operations/fees/utils";
import {FeesFilters} from "@/operations/fees/components/FeesFilter";
import {useRole} from "@/security/hooks";
import feeProvider from "@/providers/feeProvider";

export const ManagerFeeList = ({studentId, studentRef}) => {
  const role = useRole();

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={"fees"}
      filterIndicator={false}
      actions={
        role.isManager() || role.isAdmin() ? (
          <FeesActions studentId={studentId} />
        ) : null
      }
      listProps={{
        filterDefaultValues: {studentId},
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
        label="Limite de paiement du frais"
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
        label="Référence de la transaction"
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
        label="Ajout de la référence de transaction"
        showTime
      />
      <DateField
        source="mpbs.last_datetime_verification"
        label="Dernière vérification par HEI"
        showTime
      />
      <DateField
        source="mpbs.psp_own_datetime_verification"
        label="Vérification par Orange"
        showTime
      />
      <DateField
        source="mpbs.successfully_verified_on"
        label="Vérification réussie"
        showTime
      />
      {!role.isMonitor() && (
        <DeleteWithConfirm
          resourceType="fees"
          redirect={`/students/${studentId}/show/fees`}
          confirmTitle="Suppression de frais"
          confirmContent="Confirmez-vous la suppression de ce frais ?"
        />
      )}
    </HaList>
  );
};

function FeesActions({studentId}) {
  return (
    <Box>
      <CreateButton resource={`students/${studentId}/fees`} />
      <ImportButton
        resource="frais"
        provider={feeProvider.saveOrUpdate}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={(data) => transformFeesData(data, studentId)}
      />
      <FeesFilters />
    </Box>
  );
}
