import { createPortal } from "react-dom";
import { useEditController, useShowController } from "react-admin";

function getRessourceName(ressource){
  switch(ressource){
    case 'students':
      return  'Étudiants';
    case 'teachers':
      return  'Enseignants';
    default: 
        return 'Profils' 
  }
}

export function TitledPage({ title = "Hei admin", children}){
  const titleContainer = document.getElementById("pagetitle")
  return(
    <>
      { titleContainer && createPortal( 
          <span style={{padding: 0, margin: 0}}>{title}</span>, 
          titleContainer 
        )
      }
      { children }
    </>
  ) 
}

export function TitledEdit({ children, title, showCol='id'}){
  const { resource, record }= useEditController()
  const ressourceName = title ? title : getRessourceName(resource)

  return <TitledPage title={`${ressourceName} #${record[showCol]}`}>{ children }</TitledPage>
}

export function TitledShow({ children, title, showCol = 'id' }){
  const { resource, record } = useShowController()

  const ressourceName = title ? title : getRessourceName(resource)

  return <TitledPage title={`${ressourceName} #${record[showCol]}`}>{ children }</TitledPage>
}
