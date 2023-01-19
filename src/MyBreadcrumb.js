import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'

export const MyBreadcrumb = () => (
  <Breadcrumb>
    <BreadcrumbItem name='students' label='Étudiants'>
      <BreadcrumbItem
        name='edit'
        label={({ record }) => {
          if (record) {
            return <spam>{record.ref}</spam>
          }
        }}
      />
      <BreadcrumbItem
        name='show'
        label={({ record }) => {
          if (record) {
            return <spam>{record.ref}</spam>
          }
        }}
      />
      <BreadcrumbItem name='create' label='créer' />
    </BreadcrumbItem>
    <BreadcrumbItem name='teachers' label='Enseignants'>
      <BreadcrumbItem
        name='edit'
        label={({ record }) => {
          if (record) {
            return <spam>{record.ref}</spam>
          }
        }}
      />
      <BreadcrumbItem
        name='show'
        label={({ record }) => {
          if (record) {
            return <spam>{record.ref}</spam>
          }
        }}
      />
      <BreadcrumbItem name='create' label='créer' />
    </BreadcrumbItem>
    <BreadcrumbItem name='profile' label='Profiles'></BreadcrumbItem>
  </Breadcrumb>
)
