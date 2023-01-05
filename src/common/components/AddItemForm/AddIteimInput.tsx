import React, {ChangeEvent, FC, KeyboardEvent} from 'react';
import {SxProps, TextField, Theme} from "@mui/material";
import {FormikHandlers, FormikHelpers, useFormikContext} from "formik";
import {AddItemFormValues} from "./AddItemForm";

type AddItemInputProps = {
    sx?: SxProps<Theme>
    label?: string
    disabled?: boolean
}

const AddItemInput: FC<AddItemInputProps> = (props) => {
    const {sx, label, disabled} = props
    const {
        errors,
        values,
        isSubmitting,
        handleSubmit,
        handleChange,
        setErrors
    } = useFormikContext<AddItemFormValues>()

    const handleInputChange = (
        setErrors: FormikHelpers<AddItemFormValues>["setErrors"],
        handleChange: FormikHandlers["handleChange"]
    ) => (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({})
        handleChange(e)
    }

    const handleKeydown = (handleSubmit: FormikHandlers["handleSubmit"]) => {
        return (e: KeyboardEvent) => {
            if (e.key === "Enter") handleSubmit()
        }
    }

    return (
        <TextField
            variant="outlined"
            sx={{width: "300px", ...sx}}
            error={!!errors.title}
            label={errors.title ? errors.title : label}
            disabled={isSubmitting || disabled}
            name="title"
            value={values.title}
            onChange={handleInputChange(setErrors, handleChange)}
            onKeyDown={handleKeydown(handleSubmit)}
        />
    )
}

export default AddItemInput