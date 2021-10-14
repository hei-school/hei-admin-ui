import jsonServerProvider from 'ra-data-json-server'

const haDataProvider = jsonServerProvider('https://virtserver.swaggerhub.com/hei-admin/hei-admin_api/1.0')

const connectedUserId = 'string' // TODO: connect with redux-store

const dataProvider = {
  getList(resource, params) {
    if (resource === 'student-timetable' || resource === 'student-grades') {
      const student = this.getOne('profile', params)
      return student.then(response => {
        const enrolled_courses = response.data.enrolled_courses
        response.data = enrolled_courses.map(course => {
          return {
            id: course.course_id, // RA needs an id but HA provide course_id instead
            group_name: response.data.group.name,
            ...course
          }
        })
        response.total = enrolled_courses.length
        return response
      })
    }
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
