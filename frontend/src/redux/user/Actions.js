import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILURE,
    GET_PROFILE_RESET,
    GET_RECOMMENDED_USERS_REQUEST,
    GET_RECOMMENDED_USERS_SUCCESS,
    GET_RECOMMENDED_USERS_FAILURE,
    GET_RECOMMENDED_USERS_RESET,
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
    DELETE_PORTFOLIO_RESET,
    PUT_WALLET_REQUEST,
    PUT_WALLET_SUCCESS,
    PUT_WALLET_FAILURE,
    PUT_WALLET_RESET,
    GET_CONVERSATIONS_REQUEST,
    GET_CONVERSATIONS_SUCCESS,
    GET_CONVERSATIONS_FAILURE,
    GET_CONVERSATIONS_RESET,
    GET_CONVERSATION_REQUEST,
    GET_CONVERSATION_SUCCESS,
    GET_CONVERSATION_FAILURE,
    GET_CONVERSATION_RESET,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAILURE,
    SEND_MESSAGE_RESET,
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

export const tryGetPortfolio = (portfolio_id) => ({
    type: GET_PORTFOLIO_REQUEST,
    payload: {
        portfolio_id
    }
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

export const tryPostPortfolio = (title, description, date, project_id, tags) => ({
    type: POST_PORTFOLIO_REQUEST,
    payload: {
        title, 
        description, 
        date, 
        project_id,
        tags
    }
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

export const tryPutPortfolio = (portfolio_id, title, description, date, project_id) => ({
    type: PUT_PORTFOLIO_REQUEST,
    payload: {
        portfolio_id,
        title, 
        description, 
        date, 
        project_id
    }
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

export const tryDeletePortfolio = (portfolio_id) => ({
    type: DELETE_PORTFOLIO_REQUEST,
    payload: {
        portfolio_id
    }
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

export const tryPutWallet = (deposit, withdraw) => ({
    type: PUT_WALLET_REQUEST,
    payload: {
        deposit,
        withdraw
    }
});
export const putWalletSuccess = res => ({
    type: PUT_WALLET_SUCCESS,
    payload: res
});
export const putWalletFailure = errorData => ({
    type: PUT_WALLET_FAILURE,
    payload: errorData
});
export const putWalletReset = () => ({
    type: PUT_WALLET_RESET
});

export const tryGetConversations = () => ({
    type: GET_CONVERSATIONS_REQUEST,
    payload: {}
});
export const conversationsSuccess = res => ({
    type: GET_CONVERSATIONS_SUCCESS,
    payload: res
});
export const conversationsFailure = errorData => ({
    type: GET_CONVERSATIONS_FAILURE,
    payload: errorData
});
export const conversationsReset = () => ({
    type: GET_CONVERSATIONS_RESET
});

export const tryGetConversation = (user_id) => ({
    type: GET_CONVERSATION_REQUEST,
    payload: {
        user_id
    }
});
export const conversationSuccess = res => ({
    type: GET_CONVERSATION_SUCCESS,
    payload: res
});
export const conversationFailure = errorData => ({
    type: GET_CONVERSATION_FAILURE,
    payload: errorData
});
export const conversationReset = () => ({
    type: GET_CONVERSATION_RESET
});

export const trySendMessage = (user_id, message) => ({
    type: SEND_MESSAGE_REQUEST,
    payload: {
        user_id,
        message
    }
});
export const sendMessageSuccess = res => ({
    type: SEND_MESSAGE_SUCCESS,
    payload: res
});
export const sendMessageFailure = errorData => ({
    type: SEND_MESSAGE_FAILURE,
    payload: errorData
});
export const sendMessageReset = () => ({
    type: SEND_MESSAGE_RESET
});

export const tryGetRecommendedUsers = (project_id) => ({
    type: GET_RECOMMENDED_USERS_REQUEST,
    payload: {
        project_id
    }
});
export const getRecommendedUsersSuccess = res => ({
    type: GET_RECOMMENDED_USERS_SUCCESS,
    payload: res
});
export const getRecommendedUsersFailure = errorData => ({
    type: GET_RECOMMENDED_USERS_FAILURE,
    payload: errorData
});
export const getRecommendedUsersReset = () => ({
    type: GET_RECOMMENDED_USERS_RESET
});
