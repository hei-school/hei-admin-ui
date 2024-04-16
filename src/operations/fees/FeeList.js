import {FunctionField, ShowButton} from "react-admin";
import {WarningOutlined} from "@mui/icons-material";
import {rowStyle} from "./utils";
import {HaList} from "../../ui/haList/HaList";
import feeProvider from "../../providers/feeProvider";
import {useRole} from "../../security/hooks/useRole";
import {useStudentRef} from "../../hooks/useStudentRef";
import {CreateButton, ImportButton} from "../../ui/haToolbar";
import {commentFunctionRenderer} from "../utils";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "./importConf";
import {DeleteWithConfirm} from "../common/components";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";

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
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
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
