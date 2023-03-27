import axios from 'axios'

export const getThunkErrorMessage = (error: Error) => {
  let message: string

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || error.message
  } else {
    message = error.message
  }

  return message
}
