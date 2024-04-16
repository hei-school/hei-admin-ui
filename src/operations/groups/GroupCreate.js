import {Create, useGetList} from "react-admin";
import GroupForm from "./components/GroupForm";

const GroupCreate = () => {
  const {data: students = []} = useGetList("students");

  return (
    <Create resource="groups" title="Création de groupe">
      <GroupForm students={students} create />
    </Create>
  );
};
export default GroupCreate;
