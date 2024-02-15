import {HaDataProviderType} from "./HaDataProviderType";
import {toCamelCaseJSON} from "./utils";
// @ts-ignore
import * as db from "mime-db";
import {Doc} from "./types";

// TODO: waiting for the api but still temporary
const heiDocs: Doc[] = [
  {
    id: "1",
    url: "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
    data: "",
    mime_type: "application/pdf",
    file_name: "Règlement intérieur",
    created_at: new Date(2023, 10, 6),
    has_owner: false,
    owner_id: "",
  },
  {
    id: "2",
    url: "https://hei-regulations.s3.eu-west-3.amazonaws.com/%5BHEI%5D+Lettre+d%E2%80%99information+sur+l'alternance.pdf",
    data: "",
    mime_type: "application/pdf",
    file_name: "Lettre d'information sur l'alternance",
    created_at: new Date(2024, 0, 30),
    has_owner: false,
    owner_id: "",
  },
  {
    id: "3",
    url: "https://hei-regulations.s3.eu-west-3.amazonaws.com/La+devise+de+HEI.pdf",
    data: "",
    mime_type: "application/pdf",
    file_name: "La devise de HEI",
    created_at: new Date(2024, 1, 14),
    has_owner: false,
    owner_id: "",
  },
  {
    id: "4",
    url: "https://hei-regulations.s3.eu-west-3.amazonaws.com/Projections+2024+-+2025+%C3%A0+date+du+16+f%C3%A9vrier+2024.pdf",
    data: "",
    mime_type: "application/pdf",
    file_name: "Projections 2024 - 2025 à date du 16 février 2024",
    created_at: new Date(2024, 1, 14),
    has_owner: false,
    owner_id: "",
  },
];
const transform = (doc: Doc) => {
  const newDoc = toCamelCaseJSON(doc);
  newDoc.type = db[newDoc.mimeType].extensions[0];
  return newDoc;
};

const heiDocsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return heiDocs.map(transform);
  },
  async getOne(id: string) {
    return heiDocs.map(transform).find((element) => element.id === id);
  },
  async saveOrUpdate(users: Array<any>) {
    throw new Error("Not implemented");
  },
  async delete(id: string){
    throw new Error("Not implemented");
  }
};

export default heiDocsProvider;
