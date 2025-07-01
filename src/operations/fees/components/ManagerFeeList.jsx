import {DeleteWithConfirm} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {FeesFilters} from "@/operations/fees/components/FeesFilter";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "@/operations/fees/importConf";
import {PSP_COLORS, PSP_VALUES, rowStyle} from "@/operations/fees/utils";
import {commentFunctionRenderer} from "@/operations/utils";
import feeProvider from "@/providers/feeProvider";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {formatDate} from "@/utils/date";
import {WarningOutlined} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {FunctionField} from "react-admin";

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
        className: "manager-fee-list",
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
      <FunctionField
        render={(fee) => fee?.mpbs?.at(-1)?.psp_id}
        label="Référence de la transaction"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) =>
          fee.mpbs ? (
            <Chip
              color={PSP_COLORS[fee.mpbs?.at(-1)?.psp_type]}
              label={PSP_VALUES[fee.mpbs?.at(-1)?.psp_type]}
            />
          ) : (
            EMPTY_TEXT
          )
        }
        label="Type de transaction"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) => formatDate(fee?.mpbs?.at(-1)?.creation_datetime)}
        label="Ajout de la référence de transaction"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) =>
          formatDate(fee?.mpbs?.at(-1)?.last_datetime_verification)
        }
        label="Dernière vérification par HEI"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) =>
          formatDate(fee?.mpbs?.at(-1)?.psp_own_datetime_verification)
        }
        label="Vérification par PSP"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) =>
          formatDate(fee?.mpbs?.at(-1)?.successfully_verified_on)
        }
        label="Vérification réussie"
        emptyText={EMPTY_TEXT}
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
