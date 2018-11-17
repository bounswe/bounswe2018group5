import {
    GET_PROJECTS_RESET,
    GET_PROJECTS_FAILURE,
    GET_PROJECTS_SUCCESS,
    GET_PROJECTS_REQUEST,
    GET_PROJECT_RESET,
    GET_PROJECT_FAILURE,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_REQUEST,
    GET_OWN_PROJECTS_RESET,
    GET_OWN_PROJECTS_FAILURE,
    GET_OWN_PROJECTS_SUCCESS,
    GET_OWN_PROJECTS_REQUEST,
    CREATE_PROJECT_RESET,
    CREATE_PROJECT_FAILURE,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_REQUEST,
    EDIT_PROJECT_RESET,
    EDIT_PROJECT_FAILURE,
    EDIT_PROJECT_SUCCESS,
    EDIT_PROJECT_REQUEST,
    DISCARD_PROJECT_RESET,
    DISCARD_PROJECT_FAILURE,
    DISCARD_PROJECT_SUCCESS,
    DISCARD_PROJECT_REQUEST,
    DELETE_PROJECT_RESET,
    DELETE_PROJECT_FAILURE,
    DELETE_PROJECT_SUCCESS,
    DELETE_PROJECT_REQUEST,

    CREATE_BID_FAILURE,
    CREATE_BID_REQUEST,
    CREATE_BID_RESET,
    CREATE_BID_SUCCESS,
    DISCARD_BID_FAILURE,
    DISCARD_BID_REQUEST,
    DISCARD_BID_RESET,
    DISCARD_BID_SUCCESS,
    ACCEPT_BID_FAILURE,
    ACCEPT_BID_REQUEST,
    ACCEPT_BID_RESET,
    ACCEPT_BID_SUCCESS,
} from "./actionTypes";

const initialState = {
    projects: {},
    project: {},
    response: false,

    getProjectsInProgress: false,
    getProjectsHasError: false,
    getProjectsCompleted: false,
    getProjectsError: "",

    getProjectInProgress: false,
    getProjectHasError: false,
    getProjectCompleted: false,
    getProjectError: "",

    getOwnProjectsInProgress: false,
    getOwnProjectsHasError: false,
    getOwnProjectsCompleted: false,
    getOwnProjectsError: "",

    createProjectInProgress: false,
    createProjectHasError: false,
    createProjectCompleted: false,
    createProjectError: "",

    editProjectInProgress: false,
    editProjectHasError: false,
    editProjectCompleted: false,
    editProjectError: "",

    discardProjectInProgress: false,
    discardProjectHasError: false,
    discardProjectCompleted: false,
    discardProjectError: "",

    createBidInProgress: false,
    createBidHasError: false,
    createBidCompleted: false,
    createBidError: "",

    discardBidInProgress: false,
    discardBidHasError: false,
    discardBidCompleted: false,
    discardBidError: "",

    acceptBidInProgress: false,
    acceptBidHasError: false,
    acceptBidCompleted: false,
    acceptBidError: "",
};

export default function(state = initialState, action) {
    const { payload } = action;
    if (action.type === GET_PROJECTS_REQUEST) {
        return {
            ...state,
            getProjectsInProgress: true,
            getProjectsHasError: false,
            getProjectsCompleted: false
        };
    } else if (action.type === GET_PROJECTS_SUCCESS) {
        return {
            ...state,
            projects: payload.projects,
            response: payload.response,
            getProjectsInProgress: false,
            getProjectsHasError: false,
            getProjectsCompleted: true
        };
    } else if (action.type === GET_PROJECTS_FAILURE) {
        return {
            ...state,
            getProjectsInProgress: false,
            getProjectsHasError: true,
            getProjectsCompleted: true,
            getProjectsError: payload.detail[0]
        };
    } else if (action.type === GET_PROJECTS_RESET) {
        return {
            ...state,
            getProjectsInProgress: false,
            getProjectsHasError: false,
            getProjectsCompleted: false
        };
    }

    if (action.type === GET_PROJECT_REQUEST) {
        return {
            ...state,
            getProjectInProgress: true,
            getProjectHasError: false,
            getProjectCompleted: false
        };
    } else if (action.type === GET_PROJECT_SUCCESS) {
        return {
            ...state,
            project: payload.projects[0],
            response: payload.response,
            getProjectInProgress: false,
            getProjectHasError: false,
            getProjectCompleted: true
        };
    } else if (action.type === GET_PROJECT_FAILURE) {
        return {
            ...state,
            getProjectInProgress: false,
            getProjectHasError: true,
            getProjectCompleted: true,
            getProjectError: payload.detail[0]
        };
    } else if (action.type === GET_PROJECT_RESET) {
        return {
            ...state,
            getProjectInProgress: false,
            getProjectHasError: false,
            getProjectCompleted: false
        };
    }

    if (action.type === GET_OWN_PROJECTS_REQUEST) {
        return {
            ...state,
            getOwnProjectsInProgress: true,
            getOwnProjectsHasError: false,
            getOwnProjectsCompleted: false
        };
    } else if (action.type === GET_OWN_PROJECTS_SUCCESS) {
        return {
            ...state,
            projects: payload.projects,
            response: payload.response,
            getOwnProjectsInProgress: false,
            getOwnProjectsHasError: false,
            getOwnProjectsCompleted: true
        };
    } else if (action.type === GET_OWN_PROJECTS_FAILURE) {
        return {
            ...state,
            getOwnProjectsInProgress: false,
            getOwnProjectsHasError: true,
            getOwnProjectsCompleted: true,
            getOwnProjectsError: payload.detail[0]
        };
    } else if (action.type === GET_OWN_PROJECTS_RESET) {
        return {
            ...state,
            getOwnProjectsInProgress: false,
            getOwnProjectsHasError: false,
            getOwnProjectsCompleted: false
        };
    }

    if (action.type === CREATE_PROJECT_REQUEST) {
        return {
            ...state,
            createProjectInProgress: true,
            createProjectHasError: false,
            createProjectCompleted: false
        };
    } else if (action.type === CREATE_PROJECT_SUCCESS) {
        return {
            ...state,
            project: payload.project,
            response: payload.response,
            createProjectInProgress: false,
            createProjectHasError: false,
            createProjectCompleted: true
        };
    } else if (action.type === CREATE_PROJECT_FAILURE) {
        return {
            ...state,
            createProjectInProgress: false,
            createProjectHasError: true,
            createProjectCompleted: true,
            createProjectError: payload.detail[0]
        };
    } else if (action.type === CREATE_PROJECT_RESET) {
        return {
            ...state,
            createProjectInProgress: false,
            createProjectHasError: false,
            createProjectCompleted: false
        };
    }

    if (action.type === EDIT_PROJECT_REQUEST) {
        return {
            ...state,
            editProjectInProgress: true,
            editProjectHasError: false,
            editProjectCompleted: false
        };
    } else if (action.type === EDIT_PROJECT_SUCCESS) {
        return {
            ...state,
            project: payload.project,
            response: payload.response,
            editProjectInProgress: false,
            editProjectHasError: false,
            editProjectCompleted: true
        };
    } else if (action.type === EDIT_PROJECT_FAILURE) {
        return {
            ...state,
            editProjectInProgress: false,
            editProjectHasError: true,
            editProjectCompleted: true,
            editProjectError: payload.detail[0]
        };
    } else if (action.type === EDIT_PROJECT_RESET) {
        return {
            ...state,
            editProjectInProgress: false,
            editProjectHasError: false,
            editProjectCompleted: false
        };
    }

    if (action.type === DISCARD_PROJECT_REQUEST) {
        return {
            ...state,
            discardProjectInProgress: true,
            discardProjectHasError: false,
            discardProjectCompleted: false
        };
    } else if (action.type === DISCARD_PROJECT_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            discardProjectInProgress: false,
            discardProjectHasError: false,
            discardProjectCompleted: true
        };
    } else if (action.type === DISCARD_PROJECT_FAILURE) {
        return {
            ...state,
            discardProjectInProgress: false,
            discardProjectHasError: true,
            discardProjectCompleted: true,
            discardProjectError: payload.detail[0]
        };
    } else if (action.type === DISCARD_PROJECT_RESET) {
        return {
            ...state,
            discardProjectInProgress: false,
            discardProjectHasError: false,
            discardProjectCompleted: false
        };
    }

    if (action.type === CREATE_BID_REQUEST) {
        return {
            ...state,
            createBidInProgress: true,
            createBidHasError: false,
            createBidCompleted: false
        };
    } else if (action.type === CREATE_BID_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            createBidInProgress: false,
            createBidHasError: false,
            createBidCompleted: true
        };
    } else if (action.type === CREATE_BID_FAILURE) {
        return {
            ...state,
            createBidInProgress: false,
            createBidHasError: true,
            createBidCompleted: true,
            createBidError: payload.detail[0]
        };
    } else if (action.type === CREATE_BID_RESET) {
        return {
            ...state,
            createBidInProgress: false,
            createBidHasError: false,
            createBidCompleted: false
        };
    }

    if (action.type === ACCEPT_BID_REQUEST) {
        return {
            ...state,
            acceptBidInProgress: true,
            acceptBidHasError: false,
            acceptBidCompleted: false
        };
    } else if (action.type === ACCEPT_BID_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            acceptBidInProgress: false,
            acceptBidHasError: false,
            acceptBidCompleted: true
        };
    } else if (action.type === ACCEPT_BID_FAILURE) {
        return {
            ...state,
            acceptBidInProgress: false,
            acceptBidHasError: true,
            acceptBidCompleted: true,
            acceptBidError: payload.detail[0]
        };
    } else if (action.type === ACCEPT_BID_RESET) {
        return {
            ...state,
            acceptBidInProgress: false,
            acceptBidHasError: false,
            acceptBidCompleted: false
        };
    }

    if (action.type === DISCARD_BID_REQUEST) {
        return {
            ...state,
            discardBidInProgress: true,
            discardBidHasError: false,
            discardBidCompleted: false
        };
    } else if (action.type === DISCARD_BID_SUCCESS) {
        return {
            ...state,
            response: payload.response,
            discardBidInProgress: false,
            discardBidHasError: false,
            discardBidCompleted: true
        };
    } else if (action.type === DISCARD_BID_FAILURE) {
        return {
            ...state,
            discardBidInProgress: false,
            discardBidHasError: true,
            discardBidCompleted: true,
            discardBidError: payload.detail[0]
        };
    } else if (action.type === DISCARD_BID_RESET) {
        return {
            ...state,
            discardBidInProgress: false,
            discardBidHasError: false,
            discardBidCompleted: false
        };
    }

    return state;
}
