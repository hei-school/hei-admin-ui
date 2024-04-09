import {useGetList} from "react-admin";
import {Edit} from "../common/components";
import GroupForm from "./components/GroupForm";

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
