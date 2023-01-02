import React, {ChangeEvent, FC, useState} from 'react';
import {default as Typography, TypographyProps} from "@mui/material/Typography";
import Input from "@mui/material/Input";

type EditableSpanProps = {
    children: string
    disabled?: boolean
    changeTitle: (title: string) => void
} & TypographyProps

const EditableSpan: FC<EditableSpanProps> = React.memo((props) => {
    const {children, changeTitle, disabled, ...restProps} = props
    const [title, setTitle] = useState(children)
    const [editMode, setEditMode] = useState(false)

    const activateEditMode = () => {
        if (!disabled) {
            setEditMode(true)
            setTitle(children)
        }
    }

    const disableEditMode = () => {
        setEditMode(false)
        changeTitle(title)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <Input autoFocus
                 value={title}
                 onChange={handleChange}
                 onBlur={disableEditMode}
        />
        : <Typography noWrap component="span" {...restProps} onDoubleClick={activateEditMode}>
            {title}
        </Typography>

})

export default EditableSpan