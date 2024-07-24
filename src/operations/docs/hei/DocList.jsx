import {FileType} from "@haapi/typescript-client";
import {DocList as CommonDocList} from "../components/DocList";
import {OwnerType} from "../types";

export const DocList = () => {
  return (
    <CommonDocList
      owner={OwnerType.SCHOOL}
      type={FileType.DOCUMENT}
      datagridProps={{
        rowClick: (id) => `/docs/school/${id}`,
      }}
    />
  );
};
