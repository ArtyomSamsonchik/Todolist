import React, { FC } from 'react'
import { Box, IconButton, SxProps, Theme } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Formik, FormikConfig } from 'formik'
import AddItemInput from './AddItemInput'
import { BASIC_ERROR_MESSAGE } from '../../../app/constants'

export type AddItemFormValues = { title: string }

type AddItemFormProps = {
  sx?: SxProps<Theme>
  label?: string
  disabled?: boolean
  addItemCallback: (title: string) => Promise<any> | void
}

const AddItemForm: FC<AddItemFormProps> = React.memo(props => {
  const { sx, addItemCallback, label, disabled } = props

  const onSubmit: FormikConfig<AddItemFormValues>['onSubmit'] = async (
    { title },
    { resetForm, setErrors }
  ) => {
    try {
      await addItemCallback(title)
      resetForm()
    } catch (e) {
      let message: string

      if (e instanceof Error) message = e.message
      else if (typeof e === 'string') message = e
      else message = BASIC_ERROR_MESSAGE

      setErrors({ title: message })
    }
  }

  return (
    <Formik
      initialValues={{ title: '' } as AddItemFormValues}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, handleSubmit }) => {
        return (
          <Box
            component="form"
            display="flex"
            justifyContent="center"
            alignItems="center"
            onSubmit={handleSubmit}
            sx={{ pl: 1, ...sx }}
          >
            <AddItemInput label={label} disabled={disabled} isSubmitting={isSubmitting} />
            <IconButton
              type="submit"
              disabled={isSubmitting || !isValid || disabled}
              color="primary"
              sx={{ ml: 1 }}
            >
              <AddBoxIcon />
            </IconButton>
          </Box>
        )
      }}
    </Formik>
  )
})

export default AddItemForm
