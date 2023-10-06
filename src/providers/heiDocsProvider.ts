import { HaDataProviderType } from './HaDataProviderType'
import {toCamelCaseJSON} from './utils'
// @ts-ignore
import * as db from 'mime-db'

// TODO: waiting for the api but still temporary
const heiDocs = [{
  id: "1",
  url: "https://hei-transcript.s3.eu-west-3.amazonaws.com/HEI+BULLETINS/2021-2022/STD21039/STD21039.pdf",
  data: "",
  mime_type: "application/pdf",
  file_name: 'Règlement intérieure',
  created_at: new Date(2023,10,6),
  has_owner: false,
  owner_id: ""
}]
const transform = (doc: any) => {
  const newDoc = toCamelCaseJSON(doc)
  newDoc.type = db[newDoc.mimeType].extensions[0]
  return newDoc
}
const heiDocsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const docs = heiDocs.map(transform)
    return docs;
  },
  async getOne(id: string) {
    const docs = heiDocs.map(transform)
    return docs.find((element) => element.id == id)
  },
  async saveOrUpdate(users: Array<any>) {
    throw new Error('Not implemented')
  }
}

export default heiDocsProvider
