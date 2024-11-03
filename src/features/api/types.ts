export interface LoginRequestBody {
    email: string
    password: string
}

export interface InfoResponseBody {
    email: string
    isEmailConfirmed: boolean
}