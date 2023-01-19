import { Breadcrumb, BreadcrumbItem } from '@react-admin/ra-navigation'

const takeRefFunction = ({ record }) => record && <spam>{record.ref}</spam>
const takeIdFunction = ({ record }) => record && <spam>{record.id}</spam>

export const MyBreadcrumb = () => (
  <Breadcrumb>
    <BreadcrumbItem name='students' label='Étudiants'>
      <BreadcrumbItem name='edit' label={takeRefFunction} />
      <BreadcrumbItem name='show' label={takeRefFunction} />
      <BreadcrumbItem name='create' label='créer' />
    </BreadcrumbItem>
    <BreadcrumbItem name='teachers' label='Enseignants'>
      <BreadcrumbItem name='edit' label={takeRefFunction} />
      <BreadcrumbItem name='show' label={takeRefFunction} />
      <BreadcrumbItem name='create' label='créer' />
    </BreadcrumbItem>
    <BreadcrumbItem name='profile' label='Profiles' />
    <BreadcrumbItem name='fees' label='Frais'>
      <BreadcrumbItem name='edit' label={takeIdFunction} />
      <BreadcrumbItem name='show' label={takeIdFunction} />
      <BreadcrumbItem name='create' label='créer' />
    </BreadcrumbItem>
    <BreadcrumbItem name='profile' label='Profiles' />
  </Breadcrumb>
)
