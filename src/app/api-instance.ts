import axios from 'axios'

export const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  headers: {
    'API-KEY': '3a0fd058-a035-41ce-a05e-8b1d5cd36226',
  },
})

export type ApiResponse<T = {}> = {
  resultCode: ResultCode
  messages: string[]
  data: T
}

export enum ResultCode {
  Ok,
  Error,
  CaptchaIsRequired = 10,
}
