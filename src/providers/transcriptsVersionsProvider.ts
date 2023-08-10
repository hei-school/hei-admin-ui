import { HaDataProviderType } from './HaDataProviderType'
import { transcriptApi } from './api'

const raSeparator = '--'
const toRaId = (studentId: string | undefined, transcriptId: string | undefined, versionId: string | undefined): string =>
  studentId + raSeparator + transcriptId + raSeparator + versionId

export const toApi3Ids = (raId: string) => {
  const ids = raId.split(raSeparator)
  return { studentId: ids[0], transcriptId: ids[1], versionId: ids[2] }
}

const transcriptsVersionsProvider: HaDataProviderType = {
  async getList(page, perPage, filter) {
    const { studentId, transcriptId } = filter
    const result = await transcriptApi().getTranscriptsVersions(studentId, transcriptId, page, perPage)
    return result.data.map(transcript => ({
      ...transcript,
      id: toRaId(studentId, transcript.transcript_id, transcript.id)
    }))
  },

  async getOne(raId) {
    const { studentId, transcriptId, versionId } = toApi3Ids(raId)

    const result = await transcriptApi().getStudentTranscriptByVersion(studentId, transcriptId, versionId)
    return { ...result.data, id: raId }
  },

  async saveOrUpdate() {}
}

export default transcriptsVersionsProvider
