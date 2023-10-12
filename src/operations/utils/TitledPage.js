import { createPortal } from "react-dom";
import { useEditController, useShowController } from "react-admin";

export function TitledPage({ title = "Hei admin", children}){
  return(
    <>
      { createPortal( 
          <span style={{padding: 0, margin: 0}}>{title}</span>, 
          document.getElementById("pagetitle")
        )
      }
      { children }
    </>
  ) 
}

export function TitledEdit({ children, title }){
  const id = useEditController().record.id;
  return <TitledPage title={`${title} #${id}`}>{ children }</TitledPage>
}

export function TitledShow({ children, title, showCol = 'id' }){
  const id = useShowController().record[showCol];
  return <TitledPage title={`${title} #${id}`}>{ children }</TitledPage>
}
