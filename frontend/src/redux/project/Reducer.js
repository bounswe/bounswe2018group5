import {
    GET_PROJECTS_RESET,
    GET_PROJECTS_FAILURE,
    GET_PROJECTS_SUCCESS,
    GET_PROJECTS_REQUEST,
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
    DELETE_PROJECT_REQUEST
} from "./actionTypes";

const initialState = {
    projects: {},
    project: {},
    response: false,

    getProjectsInProgress: false,
    getProjectsHasError: false,
    getProjectsCompleted: false,
    getProjectsError: "",

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

    return state;
}
