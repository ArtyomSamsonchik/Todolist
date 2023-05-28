import React, { FC } from 'react'
import { Box, IconButton, SxProps, Theme } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { shallowEqual } from 'react-redux'
import { Formik, FormikConfig } from 'formik'
import AddItemInput from './AddItemInput'

export type AddItemFormValues = { title: string }

type AddItemFormProps = {
  sx?: SxProps<Theme>
  label?: string
  disabled?: boolean
  addItemCallback: (title: string) => Promise<any>
}

const propsEqualityFn = <T extends AddItemFormProps>(prevProps: T, nextProps: T) => {
  const { sx: prevSx, ...restPrevProps } = prevProps
  const { sx: nextSx, ...restNextProps } = nextProps

  return shallowEqual(prevSx, nextSx) && shallowEqual(restPrevProps, restNextProps)
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
}, propsEqualityFn)

export default AddItemForm

// TODO: remove complex shallowEqual logic. Use useMemo on parent component instead
