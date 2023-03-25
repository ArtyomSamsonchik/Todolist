import {ApiResponse, instance} from "../../app/api-instance";

export const authAPI = {
    login(data: LoginData) {
        return instance.post<ApiResponse<{ userId: number }>>("auth/login", data)
    },
    logout() {
        return instance.delete<ApiResponse>("auth/login")
    },
    me() {
        return instance.get<ApiResponse<AuthUserData>>("auth/me")
    }
}

export type AuthUserData = {
    id: number
    email: string
    login: string
}

export type LoginData = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
