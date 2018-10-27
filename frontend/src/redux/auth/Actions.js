import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_RESET,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    REGISTER_RESET,
    LOGOUT_REQUEST,
    AUTO_LOGIN
} from "./actionTypes";

export const tryLogin = (username, password) => ({
    type: LOGIN_REQUEST,
    payload: {
        username,
        password
    }
});
export const loginSuccess = res => ({
    type: LOGIN_SUCCESS,
    payload: res
});
export const loginFailure = errorData => ({
    type: LOGIN_FAILURE,
    payload: errorData
});
export const loginReset = () => ({
    type: LOGIN_RESET
});

export const tryRegister = (username, email, password, full_name) => ({
    type: REGISTER_REQUEST,
    payload: {
        username,
        email,
        password,
        full_name
    }
});
export const registerSuccess = res => ({
    type: REGISTER_SUCCESS,
    payload: res
});
export const registerFailure = errorData => ({
    type: REGISTER_FAILURE,
    payload: errorData
});
export const registerReset = () => ({
    type: REGISTER_RESET
});

export const autoLogin = (user, token) => ({
    type: AUTO_LOGIN,
    payload: {
        user,
        token
    }
});

export const logout = () => ({
    type: LOGOUT_REQUEST
});
