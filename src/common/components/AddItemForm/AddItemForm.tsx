import React, { FC } from 'react'
import { Box, IconButton, SxProps, Theme } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Formik, FormikConfig } from 'formik'
import AddItemInput from './AddItemInput'

export type AddItemFormValues = { title: string }

type AddItemFormProps = {
  sx?: SxProps<Theme>
  label?: string
  disabled?: boolean
  addItemCallback: (title: string) => Promise<any>
}

const AddItemForm: FC<AddItemFormProps> = React.memo(props => {
  const { sx, addItemCallback, label, disabled } = props

  const validate = ({ title }: AddItemFormValues) => {
    const errors: { title?: string } = {}
    if (!title.trim()) errors.title = 'Title should not be empty'
    return errors
  }

  const onSubmit: FormikConfig<AddItemFormValues>['onSubmit'] = async (
    { title },
    { resetForm }
  ) => {
    await addItemCallback(title)
    resetForm()
  }

  return (
    <Formik
      initialValues={{ title: '' } as AddItemFormValues}
      validate={validate}
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
