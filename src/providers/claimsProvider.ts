import { transcriptApi } from './api'

const claimsProvider = {

  async getList(studentId: string, transcriptId: string, versionId: string, page: number | undefined, pageSize: number | undefined){
    const result = await transcriptApi().getStudentTranscriptClaims(studentId, transcriptId, versionId, page, pageSize)
    return result.data
    },

    async getOne(studentId: string, transcriptId: string, versionId: string, claimId: string){
    const result = await transcriptApi().getStudentClaimOfTranscriptVersion(studentId, transcriptId, versionId, claimId)
    return result.data
    },

  create(){

  }

}

export default claimsProvider
