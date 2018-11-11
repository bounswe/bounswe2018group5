import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILURE,
    GET_PROFILE_RESET,
    GET_USER_PROFILE_REQUEST,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAILURE,
    GET_USER_PROFILE_RESET,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_RESET,
    CHANGE_PASSWORD_FAILURE,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_RESET,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_FAILURE
} from "./actionTypes";

const initialState = {
    user: "",
    response: false,

    getProfileInProgress: false,
    getProfileHasError: false,
    getProfileCompleted: false,
    getProfileError: "",

    getUserProfileInProgress: false,
    getUserProfileHasError: false,
    getUserProfileCompleted: false,
    getUserProfileError: "",

    changePasswordInProgress: false,
    changePasswordHasError: false,
    changePasswordCompleted: false,
    changePasswordError: "",

    updateProfileInProgress: false,
    updateProfileHasError: false,
    updateProfileCompleted: false,
    updateProfileError: "",
};

export default function(state = initialState, action) {
    const { payload } = action;
    if (action.type === GET_PROFILE_REQUEST) {
        return {
            ...state,
            getProfileInProgress: true,
            getProfileHasError: false,
            getProfileCompleted: false
        };
    } else if (action.type === GET_PROFILE_SUCCESS) {
        return {
            ...state,
            user: payload.user,
            response: payload.response,
            getProfileInProgress: false,
            getProfileHasError: false,
            getProfileCompleted: true
        };
    } else if (action.type === GET_PROFILE_FAILURE) {
        return {
            ...state,
            getProfileInProgress: false,
            getProfileHasError: true,
            getProfileCompleted: true,
            getProfileError: payload.detail[0]
        };
    } else if (action.type === GET_PROFILE_RESET) {
        return {
            ...state,
            getProfileInProgress: false,
            getProfileHasError: false,
            getProfileCompleted: false
        };
    }

    if (action.type === GET_USER_PROFILE_REQUEST) {
        return {
            ...state,
            getUserProfileInProgress: true,
            getUserProfileHasError: false,
            getUserProfileCompleted: false
        };
    } else if (action.type === GET_USER_PROFILE_SUCCESS) {
        return {
            ...state,
            user: payload.user,
            response: payload.response,
            getUserProfileInProgress: false,
            getUserProfileHasError: false,
            getUserProfileCompleted: true
        };
    } else if (action.type === GET_USER_PROFILE_FAILURE) {
        return {
            ...state,
            getUserProfileInProgress: false,
            getUserProfileHasError: true,
            getUserProfileCompleted: true,
            getUserProfileError: payload.detail[0]
        };
    } else if (action.type === GET_USER_PROFILE_RESET) {
        return {
            ...state,
            getUserProfileInProgress: false,
            getUserProfileHasError: false,
            getUserProfileCompleted: false
        };
    }

    if (action.type === CHANGE_PASSWORD_REQUEST) {
        return {
            ...state,
            changePasswordInProgress: true,
            changePasswordHasError: false,
            changePasswordCompleted: false
        };
    } else if (action.type === CHANGE_PASSWORD_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            changePasswordInProgress: false,
            changePasswordHasError: false,
            changePasswordCompleted: true
        };
    } else if (action.type === CHANGE_PASSWORD_FAILURE) {
        return {
            ...state,
            changePasswordInProgress: false,
            changePasswordHasError: true,
            changePasswordCompleted: true,
            changePasswordError: payload.detail[0]
        };
    } else if (action.type === CHANGE_PASSWORD_RESET) {
        return {
            ...state,
            response: false,
            changePasswordInProgress: false,
            changePasswordHasError: false,
            changePasswordCompleted: false
        };
    }

    if (action.type === UPDATE_PROFILE_REQUEST) {
        return {
            ...state,
            updateProfileInProgress: true,
            updateProfileHasError: false,
            updateProfileCompleted: false
        };
    } else if (action.type === UPDATE_PROFILE_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            updateProfileInProgress: false,
            updateProfileHasError: false,
            updateProfileCompleted: true
        };
    } else if (action.type === UPDATE_PROFILE_FAILURE) {
        return {
            ...state,
            updateProfileInProgress: false,
            updateProfileHasError: true,
            updateProfileCompleted: true,
            updateProfileError: payload.detail[0]
        };
    } else if (action.type === UPDATE_PROFILE_RESET) {
        return {
            ...state,
            response: false,
            updateProfileInProgress: false,
            updateProfileHasError: false,
            updateProfileCompleted: false
        };
    }

    return state;
}
