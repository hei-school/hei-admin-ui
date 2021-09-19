import React from 'react'
import { connect } from 'react-redux'

import { Resource as RaResource } from 'react-admin'

const AccessController = CandidateComponent =>
  class extends React.Component {
    render() {
      if (this.props.role === this.props.profile.role) {
        return <CandidateComponent {...this.props} />
      } else {
        return <></>
      }
    }
  }

const mapStateToProps = state => {
  return state
}
export const Resource = connect(mapStateToProps)(AccessController(RaResource))
