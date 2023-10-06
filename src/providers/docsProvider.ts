import { HaDataProviderType } from './HaDataProviderType'
import * as process from 'process'
import authProvider from './authProvider'

const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const officialTranscript = { id: 1, url: "https://hei-transcript.s3.eu-west-3.amazonaws.com/HEI+BULLETINS/2022-2023/", fileName: 'transcript 2022-2023', type: 'pdf', createdAt: new Date(2023,8,20)};
    const docsList = [officialTranscript]
    return docsList;
  },
  async getOne(id: string) {
    const officialTranscript = { id: 1, url: "https://hei-transcript.s3.eu-west-3.amazonaws.com/HEI+BULLETINS/2022-2023/STD21039/STD21039", data: "", mimeType: "", fileName: 'transcript 2022-2023', type: 'pdf', createdAt: new Date(2023,8,20)};
    return officialTranscript
  },
  async saveOrUpdate(users: Array<any>) {
    throw new Error('Not implemented')
  }
}

export default docsProvider
