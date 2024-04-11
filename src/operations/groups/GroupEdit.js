import {useGetList} from "react-admin";
import {Edit} from "../common/components";
import GroupForm from "./components/GroupForm";

const GroupEdit = () => {
  const {data: students = []} = useGetList("students");

  return (
    <Edit resource="groups" title="Groupe">
      <GroupForm students={students} create={false} />
    </Edit>
  );
};
export default GroupEdit;
