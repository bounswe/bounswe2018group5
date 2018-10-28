import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILURE,
    GET_PROFILE_RESET
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
