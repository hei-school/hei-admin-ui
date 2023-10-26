import { HaDataProviderType } from './HaDataProviderType'
import { GroupFlowMoveTypeEnum } from '../gen/haClient'
// @ts-ignore
import { teachingApi } from './api'

const groupFlowProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    throw new Error('Function not implemented.')
  },
  async getOne(id: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(payload: any) {
    console.log(payload)
    const basicDetails = {
      studentId: payload.studentId
    }
    const forMigratePayload = [
      {
        ...basicDetails,
        MoveType: payload.migrate ? GroupFlowMoveTypeEnum.Join : payload.MoveType,
        groupId: payload.groupId
      },
      {
        ...basicDetails,
        MoveType: GroupFlowMoveTypeEnum.Leave,
        groupId: payload.leftGroupId
      }
    ]
    const groupFlow = payload.migrate ? forMigratePayload : [forMigratePayload[0]]
    return await teachingApi()
      .moveOrDeleteStudentInGroup(payload.studentId, groupFlow)
      .then(result => result.data)
  }
}

export default groupFlowProvider
