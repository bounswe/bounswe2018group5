import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILURE,
    GET_PROFILE_RESET
} from "./actionTypes";

const initialState = {
    user: "",
    response: "",

    getProfileInProgress: false,
    getProfileHasError: false,
    getProfileCompleted: false,
    getProfileError: "",
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

    return state;
}
