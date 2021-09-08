import jsonServerProvider from 'ra-data-json-server'

const haDataProvider = jsonServerProvider('https://virtserver.swaggerhub.com/hei-admin/hei-admin_api/1.0')

const connectedUserId = 'string'

const dataProvider = {
  getList(resource, params) {
    return haDataProvider.getList(resource, params)
  },
  getOne(resource, params) {
    if (resource === 'profile') {
      return haDataProvider.getOne('students', { id: connectedUserId })
    }
    return haDataProvider.getOne(resource, params)
  },
  getMany(resource, params) {
    return haDataProvider.getMany(resource, params)
  },
  getManyReference(resource, params) {
    return haDataProvider.getManyReference(resource, params)
  },
  update(resource, params) {
    if (resource === 'profile') {
      return haDataProvider.update('students', { id: connectedUserId })
    }
    return haDataProvider.update(resource, params)
  },
  updateMany(resource, params) {
    return haDataProvider.updateMany(resource, params)
  },
  create(resource, params) {
    return haDataProvider.create(resource, params)
  },
  delete(resource, params) {
    return haDataProvider.delete(resource, params)
  },
  deleteMany(resource, params) {
    return haDataProvider.deleteMany(resource, params)
  }
}

export default dataProvider
