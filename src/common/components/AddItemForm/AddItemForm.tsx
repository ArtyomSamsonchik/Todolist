import React, { FC } from 'react'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { SxProps, Theme } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Formik, FormikConfig } from 'formik'
import AddItemInput from './AddItemInput'
import { BASIC_ERROR_MESSAGE } from '../../../app/constants'
import { AddItemFormContainer } from './styled'

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
      {({ isSubmitting, isValid, handleSubmit, errors }) => {
        return (
          <AddItemFormContainer sx={sx}>
            <Box
              component="form"
              display="flex"
              justifyContent="center"
              alignItems="center"
              onSubmit={handleSubmit}
              sx={{ pl: 1 }}
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
            <FormHelperText sx={{ pl: 2, pr: 7, textAlign: 'center' }} error={!!errors.title}>
              {errors.title}
            </FormHelperText>
          </AddItemFormContainer>
        )
      }}
    </Formik>
  )
})

export default AddItemForm
