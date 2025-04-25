export interface JwtPayload {
    UserName: string;
    UserId: string;
    exp: number;
    iat: number;
}

export interface ItokenData {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginData {
    username: string
    password: string
}

export interface UserState {
    userName: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: number | null
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse extends ItokenData {
    _mark?: never;
}

export interface LoginRequest extends ILoginData {
    _mark?: never;
}

export interface RamdomRegisterResponse extends ILoginData {
    _mark?: never;
}