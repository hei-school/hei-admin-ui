import { Edit, useNotify } from 'react-admin'

export const CustomEdit = ({ children, ...props }) => {
  const notify = useNotify()
  return (
    <Edit
      mutationMode='pessimistic'
      mutationOptions={{
        onError: error => {
          notify(`Une erreur s'est produite`, { type: 'error', autoHideDuration: 1000 })
        }
      }}
      {...props}
    >
      {children}
    </Edit>
  )
}
