import React, { useState } from 'react'
import { useListContext } from 'react-admin'

import { Button, Toolbar, Typography } from '@material-ui/core'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

const pageSize = 10

const haSetPerPage = (setPerPage, setPage, page) => {
  setPerPage(pageSize)
  setPage(page) // setPage has to be called after setPerPage, otherwise react-admin fails...
}

const PrevNextPagination = props => {
  var [lastPage, setLastPage] = useState(null)
  const { page, data, loaded, loading, setPage, setPerPage } = useListContext()
  haSetPerPage(setPerPage, setPage, page)
  const resourcesCount = Object.keys(data).length
  if (!lastPage && loaded && !loading && resourcesCount === 0) {
    lastPage = page - 1
    setLastPage(lastPage)
    setPage(lastPage)
  }
  if (lastPage && page === 1) {
    // react-admin redirects to page 1 if no more data to show
    // We dont't like that behavior!
    // Let the user stay on the last page.
    setPage(lastPage)
  }

  const onPrevClick = () => {
    setPage(page - 1)
    setLastPage(null)
  }
  return (
    <Toolbar>
      {page > 1 && (
        <Button color='primary' key='prev' onClick={onPrevClick}>
          <ChevronLeft />
          Précédent
        </Button>
      )}
      {(!lastPage || page < lastPage) && (
        <Button color='primary' key='next' onClick={() => setPage(page + 1)}>
          Suivant
          <ChevronRight />
        </Button>
      )}
      <div style={{ marginLeft: 'auto' }}>
        <Typography variant='body2'>
          Page : {page} &nbsp;&nbsp;Taille : {resourcesCount}
        </Typography>
      </div>
    </Toolbar>
  )
}

export default PrevNextPagination
