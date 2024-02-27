import {DocList as CommonDocList} from "../components/DocList";

export const DocList = () => {
  return (
    <CommonDocList
      owner="SCHOOL"
      datagridProps={{
        rowClick: (id) => `/docs/school/${id}`,
      }}
    />
  );
};
