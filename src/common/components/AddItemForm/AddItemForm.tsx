import React, { FC } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { SxProps, Theme } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Formik, FormikConfig } from 'formik'
import AddItemInput from './AddItemInput'
import isAppError from '../../../utils/helpers/isAppError'

export type AddItemFormValues = {
  title: string
}

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
      if (isAppError(e) && e.scope === 'validation') {
        setErrors({ title: e.message })
      } else {
        throw e
      }
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
            alignItems="flex-start"
            position="relative"
            onSubmit={handleSubmit}
            sx={sx}
          >
            <AddItemInput label={label} disabled={disabled || isSubmitting} />
            <IconButton
              type="submit"
              color="primary"
              disabled={isSubmitting || !isValid || disabled}
              sx={{ ml: 1, top: 8 }}
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
