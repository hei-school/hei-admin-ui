import { DocList as CommonDocList } from "../components/DocList";
import { OwnerType } from "../types";

export const DocList = () => {
  return (
    <CommonDocList
      owner={OwnerType.SCHOOL}
      datagridProps={{
        rowClick: (id) => `/docs/school/${id}`,
      }}
    />
  );
};
