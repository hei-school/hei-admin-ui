import {useGetList} from "react-admin";
import GroupForm from "./GroupForm";
import {Edit} from "../common/components";

const GroupEdit = () => {
  const queryStudents = useGetList("students");
  const students = queryStudents.data;

  return (
    <Edit resource="groups" title="Groupe">
      <GroupForm students={students} create={false} />
    </Edit>
  );
};
export default GroupEdit;
