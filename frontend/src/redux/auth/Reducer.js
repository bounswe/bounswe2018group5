import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_RESET,
    LOGOUT_REQUEST,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    REGISTER_RESET,
} from "./actionTypes";

const initialState = {
    api_token: "",

    loggedIn: false,

    loginInProgress: false,
    loginHasError: false,
    loginCompleted: false,
    loginError: "",

    registerInProgress: false,
    registerHasError: false,
    registerCompleted: false,
    registerError: "",
    logout: false
};

export default function(state = initialState, action) {
    const { payload } = action;
    if (action.type === LOGIN_REQUEST) {
        return {
            ...state,
            loginInProgress: true,
            loginHasError: false,
            loginCompleted: false
        };
    } else if (action.type === LOGIN_SUCCESS) {
        return {
            ...state,
            api_token: payload.api_token,
            loggedIn: payload.response,
            loginInProgress: false,
            loginHasError: false,
            loginCompleted: true
        };
    } else if (action.type === LOGIN_FAILURE) {
        return {
            ...state,
            loginInProgress: false,
            loginHasError: true,
            loginCompleted: true,
            loginError: payload.detail[0]
        };
    } else if (action.type === LOGIN_RESET) {
        return {
            ...state,
            loginInProgress: false,
            loginHasError: false,
            loginCompleted: false
        };
    }
    if (action.type === REGISTER_REQUEST) {
        return {
            ...state,
            registerInProgress: true,
            registerHasError: false,
            registerCompleted: false
        };
    } else if (action.type === REGISTER_SUCCESS) {
        return {
            ...state,
            loggedIn: false,
            registerInProgress: false,
            registerHasError: false,
            registerCompleted: true
        };
    } else if (action.type === REGISTER_FAILURE) {
        return {
            ...state,
            registerInProgress: false,
            registerHasError: true,
            registerCompleted: true,
            registerError: payload.detail[0]
        };
    } else if (action.type === REGISTER_RESET) {
        return {
            ...state,
            registerInProgress: false,
            registerHasError: false,
            registerCompleted: false
        };
    } else if (action.type === LOGOUT_REQUEST) {
        return {
            ...state,
            api_token: "",

            loggedIn: false,

            loginInProgress: false,
            loginHasError: false,
            loginCompleted: false,
            loginError: "",
            logout: true
        };
    }

    return state;
}
