import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILURE,
    GET_PROFILE_RESET,
    GET_USER_PROFILE_REQUEST,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAILURE,
    GET_USER_PROFILE_RESET,
    CHANGE_PASSWORD_FAILURE,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_RESET,
    CHANGE_PASSWORD_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_RESET,
    UPDATE_PROFILE_SUCCESS
} from "./actionTypes";

export const tryGetProfile = () => ({
    type: GET_PROFILE_REQUEST,
    payload: {}
});
export const profileSuccess = res => ({
    type: GET_PROFILE_SUCCESS,
    payload: res
});
export const profileFailure = errorData => ({
    type: GET_PROFILE_FAILURE,
    payload: errorData
});
export const profileReset = () => ({
    type: GET_PROFILE_RESET
});

export const tryGetUserProfile = (user_id) => ({
    type: GET_USER_PROFILE_REQUEST,
    payload: {
        user_id
    }
});
export const userProfileSuccess = res => ({
    type: GET_USER_PROFILE_SUCCESS,
    payload: res
});
export const userProfileFailure = errorData => ({
    type: GET_USER_PROFILE_FAILURE,
    payload: errorData
});
export const userProfileReset = () => ({
    type: GET_USER_PROFILE_RESET
});

export const tryChangePassword = (password) => ({
    type: CHANGE_PASSWORD_REQUEST,
    payload: {
        password
    }
});
export const changePasswordSuccess = res => ({
    type: CHANGE_PASSWORD_SUCCESS,
    payload: res
});
export const changePasswordFailure = errorData => ({
    type: CHANGE_PASSWORD_FAILURE,
    payload: errorData
});
export const changePasswordReset = () => ({
    type: CHANGE_PASSWORD_RESET
});

export const tryUpdateProfile = (full_name, gender, bio, type) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: {
        full_name,
        gender,
        bio,
        type
    }
});
export const updateProfileSuccess = res => ({
    type: UPDATE_PROFILE_SUCCESS,
    payload: res
});
export const updateProfileFailure = errorData => ({
    type: UPDATE_PROFILE_FAILURE,
    payload: errorData
});
export const updateProfileReset = () => ({
    type: UPDATE_PROFILE_RESET
});
