import { profileReceived } from './reduxEvents'

const profileReducer = (previousState = { id: null, role: null }, { type, profile }) => {
  if (type === profileReceived) {
    return profile
  }
  return previousState
}

export default profileReducer
