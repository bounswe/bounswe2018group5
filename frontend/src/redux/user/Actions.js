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
    UPDATE_PROFILE_SUCCESS,
    GET_PORTFOLIO_REQUEST,
    GET_PORTFOLIO_SUCCESS,
    GET_PORTFOLIO_FAILURE,
    GET_PORTFOLIO_RESET,
    POST_PORTFOLIO_REQUEST,
    POST_PORTFOLIO_SUCCESS,
    POST_PORTFOLIO_FAILURE,
    POST_PORTFOLIO_RESET,
    PUT_PORTFOLIO_REQUEST,
    PUT_PORTFOLIO_SUCCESS,
    PUT_PORTFOLIO_FAILURE,
    PUT_PORTFOLIO_RESET,
    DELETE_PORTFOLIO_REQUEST,
    DELETE_PORTFOLIO_SUCCESS,
    DELETE_PORTFOLIO_FAILURE,
    DELETE_PORTFOLIO_RESET
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

export const tryGetPortfolio = () => ({
    type: GET_PORTFOLIO_REQUEST,
    payload: {}
});
export const getPortfolioSuccess = res => ({
    type: GET_PORTFOLIO_SUCCESS,
    payload: res
});
export const getPortfolioFailure = errorData => ({
    type: GET_PORTFOLIO_FAILURE,
    payload: errorData
});
export const getPortfolioReset = () => ({
    type: GET_PORTFOLIO_RESET
});

export const tryPostPortfolio = () => ({
    type: POST_PORTFOLIO_REQUEST,
    payload: {}
});
export const postPortfolioSuccess = res => ({
    type: POST_PORTFOLIO_SUCCESS,
    payload: res
});
export const postPortfolioFailure = errorData => ({
    type: POST_PORTFOLIO_FAILURE,
    payload: errorData
});
export const postPortfolioReset = () => ({
    type: POST_PORTFOLIO_RESET
});

export const tryPutPortfolio = () => ({
    type: PUT_PORTFOLIO_REQUEST,
    payload: {}
});
export const putPortfolioSuccess = res => ({
    type: PUT_PORTFOLIO_SUCCESS,
    payload: res
});
export const putPortfolioFailure = errorData => ({
    type: PUT_PORTFOLIO_FAILURE,
    payload: errorData
});
export const putPortfolioReset = () => ({
    type: PUT_PORTFOLIO_RESET
});

export const tryDeletePortfolio = () => ({
    type: DELETE_PORTFOLIO_REQUEST,
    payload: {}
});
export const deletePortfolioSuccess = res => ({
    type: DELETE_PORTFOLIO_SUCCESS,
    payload: res
});
export const deletePortfolioFailure = errorData => ({
    type: DELETE_PORTFOLIO_FAILURE,
    payload: errorData
});
export const deletePortfolioReset = () => ({
    type: DELETE_PORTFOLIO_RESET
});
