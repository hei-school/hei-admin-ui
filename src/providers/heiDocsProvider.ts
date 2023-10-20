import { HaDataProviderType } from './HaDataProviderType'
import { toCamelCaseJSON } from './utils'
// @ts-ignore
import * as db from 'mime-db'
import { Doc } from './types'

// TODO: waiting for the api but still temporary
const heiDocs: Doc[] = [
  {
    id: '1',
    url: 'https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf',
    data: '',
    mime_type: 'application/pdf',
    file_name: 'Règlement intérieure',
    created_at: new Date(2023, 10, 6),
    has_owner: false,
    owner_id: ''
  }
]
const transform = (doc: Doc) => {
  const newDoc = toCamelCaseJSON(doc)
  newDoc.type = db[newDoc.mimeType].extensions[0]
  return newDoc
}

const heiDocsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return heiDocs.map(transform)
  },
  async getOne(id: string) {
    return heiDocs.map(transform).find(element => element.id == id)
  },
  async saveOrUpdate(users: Array<any>) {
    throw new Error('Not implemented')
  }
}

export default heiDocsProvider
