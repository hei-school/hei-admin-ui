import {DocList as CommonDocList} from "../components/DocList";
import {useType} from "../hooks/useType";

export const DocList = () => {
  const type = useType("LIST");

  return (
    <CommonDocList
      owner="STUDENT"
      type={type}
      datagridProps={{
        rowClick: (id) => `/docs/students/${type}/${id}`,
      }}
    />
  );
};
