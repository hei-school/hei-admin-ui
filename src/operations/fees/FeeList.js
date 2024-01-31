import {useEffect} from "react";
import {FunctionField, ShowButton} from "react-admin";
import {WarningOutlined} from "@mui/icons-material";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {rowStyle} from "./utils";
import {HaList} from "../../ui/haList/HaList";
import feeProvider from "../../providers/feeProvider";
import authProvider from "../../providers/authProvider";
import {useStudentRef} from "../../hooks/useStudentRef";
import {CreateButton, ImportButton} from "../../ui/haToolbar";
import {
  commentFunctionRenderer,
  CustomDateField,
  prettyPrintMoney,
} from "../utils";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "./importConf";

// /!\ TODO: update to use useRole hook
const FeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");
  const role = authProvider.getCachedRole();

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={"fees"}
      actions={
        role === WhoamiRoleEnum.MANAGER && <FeesActions studentId={studentId} />
      }
      filterIndicator={false}
      listProps={{
        filterDefaultValues: {studentId},
      }}
      datagridProps={{
        rowClick: (id) => `/fees/${id}/show`,
        rowStyle,
      }}
    >
      <CustomDateField
        source="due_datetime"
        label="Date limite"
        showTime={false}
      />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => prettyPrintMoney(record.remaining_amount)}
        textAlign="right"
      />
      <CustomDateField
        source="creation_datetime"
        label="Date de création"
        showTime={false}
      />
      <ShowButton basePath="/fees" />
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
