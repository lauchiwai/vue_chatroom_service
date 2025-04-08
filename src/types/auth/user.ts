export interface JwtPayload {
    UserName: string;
    UserId: string;
    exp: number;
    iat: number;
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

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    username: string
    password: string
}