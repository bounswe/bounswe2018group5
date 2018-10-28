import {
    GET_PROJECTS_RESET,
    GET_PROJECTS_FAILURE,
    GET_PROJECTS_SUCCESS,
    GET_PROJECTS_REQUEST,
    CREATE_PROJECT_RESET,
    CREATE_PROJECT_FAILURE,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_REQUEST
} from "./actionTypes";

const initialState = {
    projects: {},
    project: {},
    response: false,

    getProjectsInProgress: false,
    getProjectsHasError: false,
    getProjectsCompleted: false,
    getProjectsError: "",

    createProjectInProgress: false,
    createProjectHasError: false,
    createProjectCompleted: false,
    createProjectError: "",
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

    return state;
}
