import { useState } from 'react'

export const useToggle = (initialState = false) => {
  const [visible, setVisibility] = useState(initialState)
  const changeVisibility = value => setVisibility(value)
  const toggle = () => setVisibility(prev => !prev)

  return [visible, changeVisibility, toggle]
}
