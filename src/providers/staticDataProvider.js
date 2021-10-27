export const WeekDays = [
  {
    value: 1,
    day: 'Lundi'
  },
  {
    value: 2,
    day: 'Mardi'
  },
  {
    value: 3,
    day: 'Mercredi'
  },
  {
    value: 4,
    day: 'Jeudi'
  },
  {
    value: 5,
    day: 'Vendredi'
  },
  {
    value: 6,
    day: 'Samedi'
  }
]

export const Intervals = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

export const Courses = [
  {
    code: 'PROG1',
    name: 'Algorithmique',
    main_teacher_name: 'Toky',
    timetable: []
  },
  {
    code: 'WEB1',
    name: 'Interfaces web',
    main_teacher_name: 'Toky',
    timetable: []
  },
  {
    code: 'SYS1',
    name: "Systèmes d'exploitation",
    main_teacher_name: 'Harry',
    timetable: []
  },
  {
    code: 'MGT1',
    name: 'Travail collaboratif',
    main_teacher_name: 'Sandrine',
    timetable: []
  },
  {
    code: 'LANGUES1',
    name: 'Communication professionnelle',
    main_teacher_name: 'Alliance Française',
    timetable: []
  },
  {
    code: 'RENTREE',
    name: 'Rentrée Académique',
    main_teacher_name: 'HEI Admin',
    timetable: []
  },
  {
    code: 'ASSISTANCE',
    name: 'Assistance Informatique',
    main_teacher_name: 'Toky',
    timetable: []
  },
  {
    code: 'CONCOURS',
    name: 'Concours Jan 2021',
    main_teacher_name: 'HEI Admin',
    timetable: []
  },
  {
    code: 'THEORIE1',
    name: "Mathématiques de l'informatique",
    main_teacher_name: '',
    timetable: []
  }
]

const group_1 = { ref: 'G1', name: 'Groupe 1' },
  group_2 = { ref: 'G2', name: 'Groupe 2' }

function addTimetable(course_code, group, start, end) {
  for (var i = 0; i < Courses.length; i++) {
    if (Courses[i].code === course_code) {
      Courses[i].timetable.push({
        group: group,
        teacher_name: Courses[i].main_teacher_name,
        start: start,
        end: end
      })
    }
  }
}

addTimetable('RENTREE', group_1, '2021-11-08 09:00:00', '2021-11-08 11:00:00')
addTimetable('ASSISTANCE', null, '2021-11-08 11:00:00', '2021-11-08 12:00:00')
addTimetable('RENTREE', group_2, '2021-11-08 14:00:00', '2021-11-08 16:00:00')
addTimetable('ASSISTANCE', null, '2021-11-08 16:00:00', '2021-11-08 17:00:00')

//Module par semaine
addTimetable('PROG1', group_1, '2021-11-09 08:00:00', '2021-11-09 10:00:00')
addTimetable('PROG1', group_2, '2021-11-09 10:00:00', '2021-11-09 12:00:00')
addTimetable('ASSISTANCE', null, '2021-11-09 14:00:00', '2021-11-09 18:00:00')
addTimetable('WEB1', group_2, '2021-11-10 08:00:00', '2021-11-10 10:00:00')
addTimetable('WEB1', group_1, '2021-11-10 10:00:00', '2021-11-10 12:00:00')
addTimetable('PROG1', group_1, '2021-11-11 08:00:00', '2021-11-11 10:00:00')
addTimetable('PROG1', group_2, '2021-11-11 10:00:00', '2021-11-11 12:00:00')
addTimetable('WEB1', group_2, '2021-11-12 08:00:00', '2021-11-12 10:00:00')
addTimetable('WEB1', group_1, '2021-11-12 10:00:00', '2021-11-12 12:00:00')
addTimetable('CONCOURS', null, '2021-11-12 14:00:00', '2021-11-12 17:00:00')
addTimetable('SYS1', group_2, '2021-11-13 08:00:00', '2021-11-13 10:00:00')
addTimetable('SYS1', group_1, '2021-11-13 10:00:00', '2021-11-13 12:00:00')
addTimetable('CONCOURS', null, '2021-11-13 14:00:00', '2021-11-13 17:00:00')

// Modulo par semaine
addTimetable('THEORIE1', group_1, '2021-11-15 08:00:00', '2021-11-15 10:00:00')
addTimetable('THEORIE1', group_2, '2021-11-15 14:00:00', '2021-11-15 16:00:00')
addTimetable('PROG1', group_1, '2021-11-16 08:00:00', '2021-11-16 10:00:00')
addTimetable('PROG1', group_2, '2021-11-16 10:00:00', '2021-11-16 12:00:00')
addTimetable('ASSISTANCE', null, '2021-11-16 14:00:00', '2021-11-16 18:00:00')
addTimetable('WEB1', group_2, '2021-11-17 08:00:00', '2021-11-17 10:00:00')
addTimetable('WEB1', group_1, '2021-11-17 10:00:00', '2021-11-17 12:00:00')
addTimetable('PROG1', group_1, '2021-11-18 08:00:00', '2021-11-18 10:00:00')
addTimetable('PROG1', group_2, '2021-11-18 10:00:00', '2021-11-18 12:00:00')
addTimetable('WEB1', group_2, '2021-11-19 08:00:00', '2021-11-19 10:00:00')
addTimetable('WEB1', group_1, '2021-11-19 10:00:00', '2021-11-19 12:00:00')
addTimetable('SYS1', group_2, '2021-11-20 08:00:00', '2021-11-20 10:00:00')
addTimetable('SYS1', group_1, '2021-11-20 10:00:00', '2021-11-20 12:00:00')

export function getCoursesFrom(start, end) {
  var array = []
  var startOfWeek = Date.parse(start)
  var endOfWeek = Date.parse(end)
  var courses = [...Courses]

  // TO DO : refresh course data as if it's provided by an API and filter it

  // for (let i = 0; i < courses.length; i++) {
  //   for (let j = 0; j < courses[i].timetable.length; j++) {
  //     let courseStart = Date.parse(courses[i].timetable[j].start)
  //     if (!(courseStart >= startOfWeek && courseStart < endOfWeek)) {
  //       courses[i].timetable.splice(j, 1)
  //     }
  //   }
  // }

  for (let i = 0; i < courses.length; i++) {
    for (let j = 0; j < courses[i].timetable.length; j++) {
      let courseStart = Date.parse(courses[i].timetable[j].start)
      if (courseStart >= startOfWeek && courseStart < endOfWeek) {
        array.push(courses[i])
      }
    }
  }
  return array
}

export default Courses
