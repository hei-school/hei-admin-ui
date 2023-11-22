import { EditButton, TopToolbar } from "react-admin"

export const ActionsOnShow = ({ basePath, data, resource }) => {
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
    </TopToolbar>
  )
}
