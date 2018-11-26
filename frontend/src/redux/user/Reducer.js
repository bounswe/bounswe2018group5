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
    UPDATE_PROFILE_FAILURE,
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
    DELETE_PORTFOLIO_RESET,
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

    getPortfolioInProgress: false,
    getPortfolioHasError: false,
    getPortfolioCompleted: false,
    getPortfolioError: "",

    postPortfolioInProgress: false,
    postPortfolioHasError: false,
    postPortfolioCompleted: false,
    postPortfolioError: "",

    putPortfolioInProgress: false,
    putPortfolioHasError: false,
    putPortfolioCompleted: false,
    putPortfolioError: "",

    deletePortfolioInProgress: false,
    deletePortfolioHasError: false,
    deletePortfolioCompleted: false,
    deletePortfolioError: "",
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

    if (action.type === GET_PORTFOLIO_REQUEST) {
        return {
            ...state,
            getPortfolioInProgress: true,
            getPortfolioHasError: false,
            getPortfolioCompleted: false
        };
    } else if (action.type === GET_PORTFOLIO_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            getPortfolioInProgress: false,
            getPortfolioHasError: false,
            getPortfolioCompleted: true
        };
    } else if (action.type === GET_PORTFOLIO_FAILURE) {
        return {
            ...state,
            getPortfolioInProgress: false,
            getPortfolioHasError: true,
            getPortfolioCompleted: true,
            getPortfolioError: payload.detail[0]
        };
    } else if (action.type === GET_PORTFOLIO_RESET) {
        return {
            ...state,
            response: false,
            getPortfolioInProgress: false,
            getPortfolioHasError: false,
            getPortfolioCompleted: false
        };
    }

    if (action.type === POST_PORTFOLIO_REQUEST) {
        return {
            ...state,
            postPortfolioInProgress: true,
            postPortfolioHasError: false,
            postPortfolioCompleted: false
        };
    } else if (action.type === POST_PORTFOLIO_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            postPortfolioInProgress: false,
            postPortfolioHasError: false,
            postPortfolioCompleted: true
        };
    } else if (action.type === POST_PORTFOLIO_FAILURE) {
        return {
            ...state,
            postPortfolioInProgress: false,
            postPortfolioHasError: true,
            postPortfolioCompleted: true,
            postPortfolioError: payload.detail[0]
        };
    } else if (action.type === POST_PORTFOLIO_RESET) {
        return {
            ...state,
            response: false,
            postPortfolioInProgress: false,
            postPortfolioHasError: false,
            postPortfolioCompleted: false
        };
    }

    if (action.type === PUT_PORTFOLIO_REQUEST) {
        return {
            ...state,
            putPortfolioInProgress: true,
            putPortfolioHasError: false,
            putPortfolioCompleted: false
        };
    } else if (action.type === PUT_PORTFOLIO_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            putPortfolioInProgress: false,
            putPortfolioHasError: false,
            putPortfolioCompleted: true
        };
    } else if (action.type === PUT_PORTFOLIO_FAILURE) {
        return {
            ...state,
            putPortfolioInProgress: false,
            putPortfolioHasError: true,
            putPortfolioCompleted: true,
            putPortfolioError: payload.detail[0]
        };
    } else if (action.type === PUT_PORTFOLIO_RESET) {
        return {
            ...state,
            response: false,
            putPortfolioInProgress: false,
            putPortfolioHasError: false,
            putPortfolioCompleted: false
        };
    }

    if (action.type === DELETE_PORTFOLIO_REQUEST) {
        return {
            ...state,
            deletePortfolioInProgress: true,
            deletePortfolioHasError: false,
            deletePortfolioCompleted: false
        };
    } else if (action.type === DELETE_PORTFOLIO_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            deletePortfolioInProgress: false,
            deletePortfolioHasError: false,
            deletePortfolioCompleted: true
        };
    } else if (action.type === DELETE_PORTFOLIO_FAILURE) {
        return {
            ...state,
            deletePortfolioInProgress: false,
            deletePortfolioHasError: true,
            deletePortfolioCompleted: true,
            deletePortfolioError: payload.detail[0]
        };
    } else if (action.type === DELETE_PORTFOLIO_RESET) {
        return {
            ...state,
            response: false,
            deletePortfolioInProgress: false,
            deletePortfolioHasError: false,
            deletePortfolioCompleted: false
        };
    }

    return state;
}
