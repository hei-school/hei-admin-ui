import {DocList as CommonDocList} from "../components/DocList";
import {useViewType} from "../hooks/useViewType";

export const DocList = () => {
  const type = useViewType("LIST");

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
