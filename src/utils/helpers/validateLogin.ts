import { FormValues } from '../../features/Auth/LoginPage/LoginPage'

export const validateLogin =
  (captchaIsRequired: boolean) =>
  ({ email, password, captcha }: FormValues) => {
    const errors: { [K in keyof FormValues]?: string } = {}
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = 'Invalid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 4) {
      errors.password = 'Password should be more than 3 symbols'
    } else if (password.length > 14) {
      errors.password = 'Password should be less than 15 symbols'
    }

    if (captchaIsRequired && !captcha) {
      errors.captcha = 'Captcha is required'
    }

    return errors
  }
