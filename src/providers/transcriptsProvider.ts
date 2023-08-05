import { HaDataProviderType } from './HaDataProviderType'
import { transcriptApi } from './api'

const raSeparator = '--'
const toRaId = (studentId: string | undefined, transcriptId: string | undefined): string => studentId + raSeparator + transcriptId

export const toApiIds = (raId: string) => {
  const ids = raId.split(raSeparator)
  return { studentId: ids[0], transcriptId: ids[1] }
}

const transcriptsProvider: HaDataProviderType = {
  async getList(page, perPage, filter) {
    const result = await transcriptApi().getStudentTranscripts(filter.studentId, page, perPage)
    return result.data.map(transcript => ({
      ...transcript, id: toRaId(transcript.student_id, transcript.id )
    }) )
  },

  async getOne(raId) {
    const { studentId, transcriptId } = toApiIds(raId);
    const result = await transcriptApi().getStudentTranscriptById(studentId, transcriptId)
    return { ...result.data, id: raId }
  },

  async saveOrUpdate() {}
}

export default transcriptsProvider
