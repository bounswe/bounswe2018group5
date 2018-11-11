import {
    GET_PROJECTS_REQUEST,
    GET_PROJECTS_SUCCESS,
    GET_PROJECTS_FAILURE,
    GET_PROJECTS_RESET,
    GET_OWN_PROJECTS_REQUEST,
    GET_OWN_PROJECTS_SUCCESS,
    GET_OWN_PROJECTS_FAILURE,
    GET_OWN_PROJECTS_RESET,
    CREATE_PROJECT_FAILURE,
    CREATE_PROJECT_REQUEST,
    CREATE_PROJECT_RESET,
    CREATE_PROJECT_SUCCESS
} from "./actionTypes";

export const tryGetProjects = () => ({
    type: GET_PROJECTS_REQUEST,
    payload: {}
});
export const getProjectsSuccess = res => ({
    type: GET_PROJECTS_SUCCESS,
    payload: res
});
export const getProjectsFailure = errorData => ({
    type: GET_PROJECTS_FAILURE,
    payload: errorData
});
export const getProjectsReset = () => ({
    type: GET_PROJECTS_RESET
});

export const tryGetOwnProjects = () => ({
    type: GET_OWN_PROJECTS_REQUEST,
    payload: {}
});
export const getOwnProjectsSuccess = res => ({
    type: GET_OWN_PROJECTS_SUCCESS,
    payload: res
});
export const getOwnProjectsFailure = errorData => ({
    type: GET_OWN_PROJECTS_FAILURE,
    payload: errorData
});
export const getOwnProjectsReset = () => ({
    type: GET_OWN_PROJECTS_RESET
});

export const tryCreateProject = (title, description, project_deadline, budget) => ({
    type: CREATE_PROJECT_REQUEST,
    payload: {
        title,
        description,
        project_deadline,
        budget
    }
});
export const createProjectSuccess = res => ({
    type: CREATE_PROJECT_SUCCESS,
    payload: res
});
export const createProjectFailure = errorData => ({
    type: CREATE_PROJECT_FAILURE,
    payload: errorData
});
export const createProjectReset = () => ({
    type: CREATE_PROJECT_RESET
});
