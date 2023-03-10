import React, {FC} from 'react';
import {Box, IconButton, SxProps, Theme} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {shallowEqual} from "react-redux";
import {Formik, FormikHelpers} from "formik";
import AddItemInput from "./AddIteimInput";

export type AddItemFormValues = { title: string }

type AddItemFormProps = {
    sx?: SxProps<Theme>
    label?: string
    disabled?: boolean
    addItemCallback: (title: string) => Promise<any>
}

const propsEqualityFn = <T extends AddItemFormProps>(prevProps: T, nextProps: T) => {
    const {sx: prevSx, ...restPrevProps} = prevProps
    const {sx: nextSx, ...restNextProps} = nextProps

    return shallowEqual(prevSx, nextSx)
        && shallowEqual(restPrevProps, restNextProps)
}


const AddItemForm: FC<AddItemFormProps> = React.memo((props) => {
    const {sx, addItemCallback, label, disabled} = props
    const validate = ({title}: AddItemFormValues) => {
        const errors: { title?: string } = {}
        if (!title) errors.title = "Title should not be empty"
        return errors
    }

    const onSubmit = ({title}: AddItemFormValues, actions: FormikHelpers<AddItemFormValues>) => {
        return actions.validateForm({title})
            .then(() => addItemCallback(title))
            .then(() => actions.resetForm())
    }

    return (
        <Formik
            initialValues={{title: ""}}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={onSubmit}
        >
            {({isSubmitting, handleSubmit}) => {
                return (
                    <Box
                        component="form"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        onSubmit={handleSubmit}
                    >
                        <AddItemInput sx={sx} label={label} disabled={disabled}/>
                        <IconButton
                            type="submit"
                            disabled={isSubmitting || disabled}
                            color="primary"
                        >
                            <AddBoxIcon/>
                        </IconButton>
                    </Box>
                )
            }}
        </Formik>
    )
}, propsEqualityFn)

export default AddItemForm