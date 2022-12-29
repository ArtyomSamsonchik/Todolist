import React, {useState} from 'react';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import {Formik} from "formik";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks";
import {loginTC, selectIsLoggedIn} from "../auth-reducer";
import {validateLogin} from "../../../common/utils/validateLogin";
import LoginFormInput from "./LoginFormInput/LoginFormInput";

export type FormValues = {
    email: string,
    password: string,
    rememberMe: boolean
}

const LoginPage = () => {
    const [isVisible, setIsVisible] = useState(false)
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(selectIsLoggedIn)

    const toggleIsVisible = () => {
        setIsVisible(prevVisible => !prevVisible)
    }

    if (isLoggedIn) {
        return <Navigate to="/" replace/>
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                rememberMe: false
            } as FormValues}
            validate={validateLogin}
            onSubmit={(values) => dispatch(loginTC(values))}
        >
            {(formik) => {
                return (
                    <Container component="form" maxWidth="xs" onSubmit={formik.handleSubmit}>
                        <LoginFormInput name="email" label="email"/>
                        <LoginFormInput
                            name="password"
                            label="password"
                            type={isVisible ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={toggleIsVisible}>
                                            {isVisible ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>

                                )
                            }}
                        />
                        <FormControlLabel
                            sx={{mt: 1, mb: 0.5}}
                            control={
                                <Checkbox
                                    checked={formik.values.rememberMe}
                                    {...formik.getFieldProps("rememberMe")}
                                />
                            }
                            label="Remember me"
                        />
                        <Button
                            size="large"
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{mt: 0.5}}
                            disabled={!formik.isValid}
                        >
                            Login
                        </Button>
                    </Container>
                )
            }}
        </Formik>
    )
}

export default LoginPage