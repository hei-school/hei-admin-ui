import { render, screen } from '@testing-library/react'
import Timetable from '../timetable'

test('renders static timetable', () => {
  render(<Timetable />)
  const monday = screen.getByText('Lundi')
  expect(monday).toBeInTheDocument()
})
