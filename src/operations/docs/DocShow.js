import { useDataProvider, useRedirect } from 'react-admin'
import { Button, Divider, styled, Typography, useMediaQuery } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FilePreviewer from 'react-file-previewer'
import { ArrowBack, Download } from '@mui/icons-material'

const DocLayout = ({ resource }) => {
  const params = useParams()
  const redirect = useRedirect()
  const dataProvider = useDataProvider()
  const isSmall = useMediaQuery('(max-width: 900px)')
  const [file, setFile] = useState({})
  const id = params.id

  const FilePreviewerContainer = styled('div')({
    height: '80vh',
    width: '60vw',
    overflowY: 'scroll',
    margin: 'auto'
  })

  useEffect(() => {
    const getFile = async () => await dataProvider.getOne(resource, { id: id })
    getFile().then(result => setFile(result.data))
  }, [])

  const handleClose = () => redirect('list', resource)

  // TODO: change this when the api is ready
  const downloadFile = () => {
    if (file) {
      fetch(file.url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${file.fileName}.${file.type}`
          a.click()
        })
    }
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
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr' }}>
        <Typography variant='h6'>Document : {file.fileName}</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '1vw' }}>
          {buttons.map(button => (
            <Button key={button.text} onClick={button.onClick} variant='outlined' size='small'>
              {isSmall ? button.icon : button.text}
            </Button>
          ))}
        </div>
      </div>
      <Divider sx={{ mt: 2, mb: 1 }} />
      <FilePreviewerContainer>
        <FilePreviewer file={file} hideControls={true} />
      </FilePreviewerContainer>
    </>
  )
}
export default DocLayout
