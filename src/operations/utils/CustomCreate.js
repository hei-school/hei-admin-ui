import { Create, useNotify } from 'react-admin'

export const CustomCreate = ({ children, ...props }) => {
  const notify = useNotify()
  return (
    <Create
      mutationMode='pessimistic'
      mutationOptions={{
        onError: error => {
          notify(`Une erreur s'est produite`, { type: 'error', autoHideDuration: 1000 })
        }
      }}
      {...props}
    >
      {children}
    </Create>
  )
}
