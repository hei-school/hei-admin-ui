import { Show, SimpleShowLayout, useDataProvider, useRedirect } from 'react-admin'
import { Button, styled, Typography, useMediaQuery } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FilePreviewer from 'react-file-previewer'
import { ArrowBack, Download } from '@mui/icons-material'
import authProvider from '../../providers/authProvider'

const DocShow = () => {
  const params = useParams()
  const redirect = useRedirect()
  const dataProvider = useDataProvider()
  const isSmall = useMediaQuery('(max-width: 900px)')
  const [file, setFile] = useState({})
  const [studentRef, setStudentRef]= useState('')
  const whoamiId = authProvider.getCachedWhoami().id;

  const id = params.id
  const FilePreviewerContainer = styled('div')({
    height: '80vh',
    width: '60vw',
    overflowY: 'scroll',
    margin: 'auto'
  })

  useEffect(() => {
    const getSelfStudent = () => dataProvider.getOne('students', {id: whoamiId})
    const getFile = async () => await dataProvider.getOne('docs', { id: id })
    getFile().then((result) => setFile(result.data))
      .then(() => {
      // TODO: temporary until we can get the response from the backend
        getSelfStudent().then((result) => setFile({ ...file, url: `${file.url}${result.data.ref}/${result.data.ref}.pdf`}))
    })
  }, [])
  const handleClose = () => redirect('/docs')
  const downloadFile = () => {
    fetch(file.url)
      .then((response) => response.blob()).then((blob) => {
      let url = window.URL.createObjectURL(blob)
      let a = document.createElement('a')
      a.href = url
      a.download = `${file.fileName}.${file.type}`
      a.click()
    })
  }
  const buttons = [
    {
      icon: <Download />,
      text: 'télécharger',
      onClick: downloadFile
    },
    {
      icon: <ArrowBack />,
      text: 'retour',
      onClick: handleClose
    }
    ]

  return (
    <Show title='Document'>
      <SimpleShowLayout>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr' }}>
          <Typography variant='h6'>Document : {file.fileName}</Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '1vw' }}>
            {
              buttons.map((button) => (<Button onClick={button.onClick} variant='outlined' size='small'>
                {isSmall ? button.icon : button.text}
              </Button>))
            }
          </div>
        </div>
        <FilePreviewerContainer>
          <FilePreviewer
            file={file}
            hideControls={true} />
        </FilePreviewerContainer>
      </SimpleShowLayout>
    </Show>
  )
}
export default DocShow