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

const initialState = {
    user: "",
    response: false,
    portfolio: "",
    wallet: "",
    conversations: [],
    conversation: {},

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

    putWalletInProgress: false,
    putWalletHasError: false,
    putWalletCompleted: false,
    putWalletError: "",

    getConversationsInProgress: false,
    getConversationsHasError: false,
    getConversationsCompleted: false,
    getConversationsError: "",

    getConversationInProgress: false,
    getConversationHasError: false,
    getConversationCompleted: false,
    getConversationError: "",

    sendMessageInProgress: false,
    sendMessageHasError: false,
    sendMessageCompleted: false,
    sendMessageError: "",
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
            portfolio: payload.portfolio,
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
            portfolio: payload.portfolio,
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
            portfolio: payload.portfolio,
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

    if (action.type === PUT_WALLET_REQUEST) {
        return {
            ...state,
            putWalletInProgress: true,
            putWalletHasError: false,
            putWalletCompleted: false
        };
    } else if (action.type === PUT_WALLET_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            wallet: payload.wallet,
            putWalletInProgress: false,
            putWalletHasError: false,
            putWalletCompleted: true
        };
    } else if (action.type === PUT_WALLET_FAILURE) {
        return {
            ...state,
            putWalletInProgress: false,
            putWalletHasError: true,
            putWalletCompleted: true,
            putWalletError: payload.detail[0]
        };
    } else if (action.type === PUT_WALLET_RESET) {
        return {
            ...state,
            response: false,
            putWalletInProgress: false,
            putWalletHasError: false,
            putWalletCompleted: false
        };
    }

    if (action.type === GET_CONVERSATIONS_REQUEST) {
        return {
            ...state,
            getConversationsInProgress: true,
            getConversationsHasError: false,
            getConversationsCompleted: false
        };
    } else if (action.type === GET_CONVERSATIONS_SUCCESS) {
        return {
            ...state,
            conversations: payload.conversations,
            getConversationsInProgress: false,
            getConversationsHasError: false,
            getConversationsCompleted: true
        };
    } else if (action.type === GET_CONVERSATIONS_FAILURE) {
        return {
            ...state,
            getConversationsInProgress: false,
            getConversationsHasError: true,
            getConversationsCompleted: true,
            getConversationsError: payload.detail[0]
        };
    } else if (action.type === GET_CONVERSATIONS_RESET) {
        return {
            ...state,
            getConversationsInProgress: false,
            getConversationsHasError: false,
            getConversationsCompleted: false
        };
    }

    if (action.type === GET_CONVERSATION_REQUEST) {
        return {
            ...state,
            getConversationInProgress: true,
            getConversationHasError: false,
            getConversationCompleted: false
        };
    } else if (action.type === GET_CONVERSATION_SUCCESS) {
        return {
            ...state,
            conversation: payload.conversation,
            getConversationInProgress: false,
            getConversationHasError: false,
            getConversationCompleted: true
        };
    } else if (action.type === GET_CONVERSATION_FAILURE) {
        return {
            ...state,
            getConversationInProgress: false,
            getConversationHasError: true,
            getConversationCompleted: true,
            getConversationError: payload.detail[0]
        };
    } else if (action.type === GET_CONVERSATION_RESET) {
        return {
            ...state,
            getConversationInProgress: false,
            getConversationHasError: false,
            getConversationCompleted: false
        };
    }

    if (action.type === SEND_MESSAGE_REQUEST) {
        return {
            ...state,
            sendMessageInProgress: true,
            sendMessageHasError: false,
            sendMessageCompleted: false
        };
    } else if (action.type === SEND_MESSAGE_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            sendMessageInProgress: false,
            sendMessageHasError: false,
            sendMessageCompleted: true
        };
    } else if (action.type === SEND_MESSAGE_FAILURE) {
        return {
            ...state,
            sendMessageInProgress: false,
            sendMessageHasError: true,
            sendMessageCompleted: true,
            sendMessageError: payload.detail[0]
        };
    } else if (action.type === SEND_MESSAGE_RESET) {
        return {
            ...state,
            sendMessageInProgress: false,
            sendMessageHasError: false,
            sendMessageCompleted: false
        };
    }

    return state;
}
