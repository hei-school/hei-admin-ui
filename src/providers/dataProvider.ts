import { HaDataProviderType } from './HaDataProviderType'
import { RaDataProviderType } from './RaDataProviderType'
import profileProvider from './profileProvider'
import studentProvider from './studentProvider'
import feeProvider from './feeProvider'
import teacherProvider from './teacherProvider'

const getProvider = (resourceType: string): HaDataProviderType => {
  if (resourceType === 'profile') return profileProvider
  if (resourceType === 'students') return studentProvider
  if (resourceType === 'fees') return feeProvider
  if (resourceType === 'teachers') return teacherProvider
  throw new Error('Unexpected resourceType: ' + resourceType)
}

const dataProvider: RaDataProviderType = {
  async getList(resourceType: string, params: any) {
    const pagination = params.pagination
    const page = pagination.page === 0 ? 1 /* TODO(empty-pages) */ : pagination.page
    const perPage = pagination.perPage > 500 ? 500 : pagination.perPage //TODO: may be appropriate eslswhere? if here, put at least a warning
    const filter = params.filter
    const result = await getProvider(resourceType).getList(page, perPage, filter)
    return { data: result, total: Number.MAX_SAFE_INTEGER }
  },
  async getOne(resourceType: string, params: any) {
    const result = await getProvider(resourceType).getOne(params.id)
    return { data: result }
  },
  async update(resourceType: string, params: any) {
    const result = await getProvider(resourceType).saveOrUpdate([params.data])
    return { data: result[0] }
  },
  async create(resourceType: string, params: any) {
    const result = await getProvider(resourceType).saveOrUpdate(
      resourceType === 'students' || resourceType === 'teachers' ? toEnabledUsers([params.data]) : [params.data]
    )
    return { data: result[0] }
  }
}

const toEnabledUsers = (users: Array<any>): Array<any> => {
  let enabledUsers = []
  for (const user of users) {
    let enabledUser = Object.assign(user)
    enabledUser.status = 'ENABLED'
    enabledUsers.push(enabledUser)
  }
  return enabledUsers
}

export default dataProvider
