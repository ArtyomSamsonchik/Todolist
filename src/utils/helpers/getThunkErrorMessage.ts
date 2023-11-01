import axios from 'axios'
import { BASIC_ERROR_MESSAGE, NO_INTERNET_ERROR_MESSAGE } from '../../app/constants'

export const getThunkErrorMessage = (error: unknown) => {
  let message = BASIC_ERROR_MESSAGE

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || NO_INTERNET_ERROR_MESSAGE
  } else if (error instanceof Error) {
    message = error.message
  }

  return message
}
