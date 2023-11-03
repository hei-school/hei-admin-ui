import { HaDataProviderType } from './HaDataProviderType'
import { GroupFlowMoveTypeEnum } from '../gen/haClient'
import { teachingApi } from './api'

const groupFlowProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    throw new Error('Function not implemented.')
  },
  async getOne(id: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(payload: any) {
    const basicDetails = {
      studentId: payload.studentId
    }
    const forMigratePayload = [
      {
        ...basicDetails,
        MoveType: payload.canCreate ? payload.MoveType : GroupFlowMoveTypeEnum.Join,
        groupId: payload.groupId
      },
      {
        ...basicDetails,
        MoveType: GroupFlowMoveTypeEnum.Leave,
        groupId: payload.leftGroupId
      }
    ]
    const groupFlow = payload.canCreate ? [forMigratePayload[0]] : forMigratePayload
    return await teachingApi()
      .moveOrDeleteStudentInGroup(payload.studentId, groupFlow)
      .then(result => result.data)
  }
}

export default groupFlowProvider
