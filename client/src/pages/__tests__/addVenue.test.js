import '@testing-library/jest-dom/extend-expect'
import { render, cleanup } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from '../../store'
import AddVenue from '../add-promos/AddVenue'

afterEach(cleanup)

it('renders inputs with the proper type', () => {
  const { getByPlaceholderText, getByText } = render(
    <Provider store={store}>
      <Router>
        <AddVenue />
      </Router>
    </Provider>
  )
  expect(getByPlaceholderText(/title/i)).toHaveAttribute('type', 'text')
  expect(getByPlaceholderText(/paste embed code/i)).toHaveAttribute(
    'type',
    'text'
  )
  expect(getByPlaceholderText(/quick description/i)).toHaveAttribute(
    'type',
    'text'
  )
  expect(getByText(/submit/i)).toHaveAttribute('type', 'submit')
})
