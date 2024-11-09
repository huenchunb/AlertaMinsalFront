export interface LoginRequestBody {
    email: string
    password: string
}

export interface InfoResponseBody {
    email: string
    isEmailConfirmed: boolean
}

export interface BaseType {
    id: string,
    name: string
}