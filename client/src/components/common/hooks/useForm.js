import { useState } from 'react'

export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)

  return [
    values,
    e => {
      setValues({
        ...values,
        [e.target.name]: e.target.value
      })
    }
  ]
}
