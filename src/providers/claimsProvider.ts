import { HaDataProviderType } from './HaDataProviderType'
import { transcriptApi } from './api'

const claimsProvider: HaDataProviderType = {
  async getList(page, perPage, filter) {
    const { studentId, transcriptId, versionId } = filter
    const result = await transcriptApi().getStudentTranscriptClaims(studentId, transcriptId, versionId, page, perPage)
    return result.data
    },

  async getOne(studentId) {
   
  },

 async saveOrUpdate() {}
}

export default claimsProvider
