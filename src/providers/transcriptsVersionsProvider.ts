import { transcriptApi } from './api'

const transcriptsVersionsProvider = {

 async getList(studentId: string, transcriptId: string, page: number | undefined, perPage: number | undefined){
     const result = await transcriptApi().getTranscriptsVersions(studentId, transcriptId, page, perPage )
      return result.data
  },

  async getOne(studentId: string, transcriptId: string, versionId: string){
      const result = await transcriptApi().getStudentTranscriptByVersion(studentId, transcriptId, versionId)
      return result.data
  },

   saveOrUpdate(){

  }

}

export default transcriptsVersionsProvider
