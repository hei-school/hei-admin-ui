import { HaDataProviderType } from './HaDataProviderType'
const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    throw new Error('Not implemented')
  },
  async getOne(id: string) {
    const officialTranscript = { id: 1, url: "https://hei-transcript.s3.eu-west-3.amazonaws.com/HEI+BULLETINS/2021-2022/STD21039/STD21039", data: "", mimeType: "", fileName: 'transcript 2022-2023', type: 'pdf', createdAt: new Date(2023,8,20)};
    return officialTranscript
  },
  async saveOrUpdate(users: Array<any>) {
    throw new Error('Not implemented')
  }
}

export default docsProvider
