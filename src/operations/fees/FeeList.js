import {FunctionField, ShowButton} from "react-admin";
import {WarningOutlined} from "@mui/icons-material";
import {HaList} from "../../ui/haList/HaList";
import {CreateButton, ImportButton} from "../../ui/haToolbar";
import {DeleteWithConfirm} from "../common/components";
import {DateField} from "../common/components/fields";
import {rowStyle} from "./utils";
import {useStudentRef} from "../../hooks/useStudentRef";
import {useRole} from "../../security/hooks/useRole";
import {renderMoney} from "../common/utils/money";
import feeProvider from "../../providers/feeProvider";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "./importConf";
import {EMPTY_FEE_COMMENT} from "./utils/empty";

const FeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");
  const role = useRole();

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={"fees"}
      actions={role.isManager() && <FeesActions studentId={studentId} />}
      filterIndicator={false}
      listProps={{
        filterDefaultValues: {studentId},
      }}
      datagridProps={{
        rowClick: (id) => `/fees/${id}/show`,
        rowStyle,
      }}
    >
      <DateField source="due_datetime" label="Date limite" showTime={false} />
      <FunctionField
        source="comment"
        render={(fee) => fee.comment || EMPTY_FEE_COMMENT}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
        textAlign="right"
      />
      <DateField
        source="creation_datetime"
        label="Date de création"
        showTime={false}
      />
      {role.isManager() ? (
        <DeleteWithConfirm
          resourceType="fees"
          redirect={`/students/${studentId}/fees`}
          confirmTitle="Suppression de frais"
          confirmContent="Confirmez-vous la suppression de ce frais ?"
        />
      ) : (
        <ShowButton basePath="/fees" />
      )}
    </HaList>
  );
};

export default FeeList;

function FeesActions({studentId}) {
  return (
    <>
      <CreateButton resource={`students/${studentId}/fees`} />
      <ImportButton
        resource="frais"
        provider={feeProvider.saveOrUpdate}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={(data) => transformFeesData(data, studentId)}
      />
    </>
  );
}
