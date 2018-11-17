import {call, put, takeLatest} from "redux-saga/effects";

import {LOGIN_REQUEST, LOGOUT_REQUEST, REGISTER_REQUEST} from "../auth/actionTypes";
import {CHANGE_PASSWORD_REQUEST, GET_PROFILE_REQUEST, GET_USER_PROFILE_REQUEST, UPDATE_PROFILE_REQUEST} from "../user/actionTypes";
import { 
    CREATE_PROJECT_REQUEST, 
    EDIT_PROJECT_REQUEST, 
    DISCARD_PROJECT_REQUEST, 
    GET_PROJECTS_REQUEST, 
    GET_PROJECT_REQUEST, 
    GET_OWN_PROJECTS_REQUEST,
    CREATE_BID_REQUEST, 
} from "../project/actionTypes";
import {
    getProjectsFailure, 
    getProjectsSuccess,
    getProjectFailure,
    getProjectSuccess, 
    createProjectSuccess, 
    createProjectFailure,
    editProjectSuccess,
    editProjectFailure,
    discardProjectSuccess,
    discardProjectFailure,
    getOwnProjectsFailure, 
    getOwnProjectsSuccess,
    createBidSuccess,
    createBidFailure,
} from "../project/Actions";
import {loginSuccess, loginFailure, registerFailure, registerSuccess} from "../auth/Actions";
import {
    profileSuccess,
    profileFailure,
    userProfileSuccess,
    userProfileFailure,
    changePasswordSuccess,
    changePasswordFailure,
    updateProfileFailure,
    updateProfileSuccess
} from "../user/Actions";


import api from "./api";

const tryLoginSaga = function* (action) {
    const {username, password} = action.payload;

    try {
        const loginResponse = yield call(api.doLogin, username, password);

        if (loginResponse) {
            console.log("​loginResponse", loginResponse);

            if (loginResponse.status === 200) {
                yield put(loginSuccess(loginResponse.responseBody));
            } else if (loginResponse.status === 400) {
                console.log("Something wrong! Got a status 400", loginResponse.responseBody);
                yield put(loginFailure(loginResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", loginResponse);
                yield put(loginFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Login failed by api. No response !");
            yield put(loginFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Login failed by api. Error => ", err);
        yield put(loginFailure({detail: [err.detail]}));
    }
};

const tryRegisterSaga = function* (action) {
    const {username, email, password, full_name} = action.payload;

    try {
        const registerResponse = yield call(api.doRegister, username, email, password, full_name);

        if (registerResponse) {
            console.log("registerResponse", registerResponse);

            if (registerResponse.status === 200) {
                yield put(registerSuccess(registerResponse.responseBody));
            } else if (registerResponse.status === 400) {
                console.log("Something wrong! Got a status 400", registerResponse.responseBody);
                yield put(registerFailure(registerResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", registerResponse);
                yield put(registerFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Register failed by api. No response !");
            yield put(registerFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Register failed by api. Error => ", err);
        yield put(registerFailure({detail: [err.detail]}));
    }
};

const tryLogout = function* () {
    try {
        const logoutResponse = yield call(api.doLogout);

        if (logoutResponse) {
            console.log("logoutResponse", logoutResponse);
        } else {
            console.log("Logout failed by api. No response !");
        }
    } catch (err) {
        console.log("Logout failed by api. Error => ", err);
    }
};

const tryGetProfileSaga = function* () {
    try {
        const getProfileResponse = yield call(api.getProfile);

        if (getProfileResponse) {
            console.log("getProfileResponse", getProfileResponse);

            if (getProfileResponse.status === 200) {
                yield put(profileSuccess(getProfileResponse.responseBody));
            } else if (getProfileResponse.status === 400) {
                console.log("Something wrong! Got a status 400", getProfileResponse.responseBody);
                yield put(profileFailure(getProfileResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", getProfileResponse);
                yield put(profileFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Get Profile failed by api. No response !");
            yield put(profileFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Get Profile failed by api. Error => ", err);
        yield put(profileFailure({detail: [err.detail]}));
    }
};

const tryGetUserProfileSaga = function* (action) {
    try {
        const {user_id} = action.payload;

        const getUserProfileResponse = yield call(api.getUserProfile, user_id);

        if (getUserProfileResponse) {
            console.log("getUserProfileResponse", getUserProfileResponse);

            if (getUserProfileResponse.status === 200) {
                yield put(userProfileSuccess(getUserProfileResponse.responseBody));
            } else if (getUserProfileResponse.status === 400) {
                console.log("Something wrong! Got a status 400", getUserProfileResponse.responseBody);
                yield put(userProfileFailure(getUserProfileResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", getUserProfileResponse);
                yield put(userProfileFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Get Profile failed by api. No response !");
            yield put(userProfileFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Get Profile failed by api. Error => ", err);
        yield put(userProfileFailure({ detail: [err.detail] }));
    }
};

const tryUpdateProfileSaga = function* (action) {
    try {
        const {full_name, gender, bio, type} = action.payload;

        const updateProfileResponse = yield call(api.updateProfile, full_name, gender, bio, type);

        if (updateProfileResponse) {
            console.log("updateProfileResponse", updateProfileResponse);

            if (updateProfileResponse.status === 200) {
                yield put(updateProfileSuccess(updateProfileResponse.responseBody));
            } else if (updateProfileResponse.status === 400) {
                console.log("Something wrong! Got a status 400", updateProfileResponse.responseBody);
                yield put(updateProfileFailure(updateProfileResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", updateProfileResponse);
                yield put(updateProfileFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Update Profile failed by api. No response !");
            yield put(updateProfileFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Update Profile failed by api. Error => ", err);
        yield put(updateProfileFailure({detail: [err.detail]}));
    }
};

const tryChangePasswordSaga = function* (action) {
    try {
        const {password} = action.payload;

        const changePasswordResponse = yield call(api.changePassword, password);

        if (changePasswordResponse) {
            console.log("changePasswordResponse", changePasswordResponse);

            if (changePasswordResponse.status === 200) {
                yield put(changePasswordSuccess(changePasswordResponse.responseBody));
            } else if (changePasswordResponse.status === 400) {
                console.log("Something wrong! Got a status 400", changePasswordResponse.responseBody);
                yield put(changePasswordFailure(changePasswordResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", changePasswordResponse);
                yield put(changePasswordFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Change Password failed by api. No response !");
            yield put(changePasswordFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Change Password failed by api. Error => ", err);
        yield put(changePasswordFailure({detail: [err.detail]}));
    }
};

const tryGetProjectsSaga = function* () {
    try {
        const getProjectsResponse = yield call(api.getProjects);

        if (getProjectsResponse) {
            console.log("getProjectsResponse", getProjectsResponse);

            if (getProjectsResponse.status === 200) {
                yield put(getProjectsSuccess(getProjectsResponse.responseBody));
            } else if (getProjectsResponse.status === 400) {
                console.log("Something wrong! Got a status 400", getProjectsResponse.responseBody);
                yield put(getProjectsFailure(getProjectsResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", getProjectsResponse);
                yield put(getProjectsFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Get Projects failed by api. No response !");
            yield put(getProjectsFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Get Projects failed by api. Error => ", err);
        yield put(getProjectsFailure({detail: [err.detail]}));
    }
};

const tryGetProjectSaga = function* (action) {
    try {
        const { project_id } = action.payload;
        
        const getProjectResponse = yield call(api.getProject, project_id);

        if (getProjectResponse) {
            console.log("getProjectResponse", getProjectResponse);

            if (getProjectResponse.status === 200) {
                yield put(getProjectSuccess(getProjectResponse.responseBody));
            } else if (getProjectResponse.status === 400) {
                console.log("Something wrong! Got a status 400", getProjectResponse.responseBody);
                yield put(getProjectFailure(getProjectResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", getProjectResponse);
                yield put(getProjectFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Get Project failed by api. No response !");
            yield put(getProjectFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Get Project failed by api. Error => ", err);
        yield put(getProjectFailure({ detail: [err.detail] }));
    }
};

const tryGetOwnProjectsSaga = function* () {
    try {
        const getOwnProjectsResponse = yield call(api.getOwnProjects);

        if (getOwnProjectsResponse) {
            console.log("getOwnProjectsResponse", getOwnProjectsResponse);

            if (getOwnProjectsResponse.status === 200) {
                yield put(getOwnProjectsSuccess(getOwnProjectsResponse.responseBody));
            } else if (getOwnProjectsResponse.status === 400) {
                console.log("Something wrong! Got a status 400", getOwnProjectsResponse.responseBody);
                yield put(getOwnProjectsFailure(getOwnProjectsResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", getOwnProjectsResponse);
                yield put(getOwnProjectsFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Get Projects failed by api. No response !");
            yield put(getOwnProjectsFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Get Projects failed by api. Error => ", err);
        yield put(getOwnProjectsFailure({ detail: [err.detail] }));
    }
};

const tryCreateProjectSaga = function* (action) {
    try {
        const { title, description, project_deadline, budget } = action.payload;

        const createProjectResponse = yield call(api.createProject, title, description, project_deadline, budget);

        if (createProjectResponse) {
            console.log("createProjectResponse", createProjectResponse);

            if (createProjectResponse.status === 200) {
                yield put(createProjectSuccess(createProjectResponse.responseBody));
            } else if (createProjectResponse.status === 400) {
                console.log("Something wrong! Got a status 400", createProjectResponse.responseBody);
                yield put(createProjectFailure(createProjectResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", createProjectResponse);
                yield put(createProjectFailure({detail: ["Unknown status. Check console!"]}));
            }
        } else {
            console.log("Create Project failed by api. No response !");
            yield put(createProjectFailure({detail: ["No response fetched. Please contact the API team!"]}));
        }
    } catch (err) {
        console.log("Create Project failed by api. Error => ", err);
        yield put(createProjectFailure({detail: [err.detail]}));
    }
};

const tryEditProjectSaga = function* (action) {
    try {
        const { project_id, description } = action.payload;

        const editProjectResponse = yield call(api.editProject, project_id, description);

        if (editProjectResponse) {
            console.log("editProjectResponse", editProjectResponse);

            if (editProjectResponse.status === 200) {
                yield put(editProjectSuccess(editProjectResponse.responseBody));
            } else if (editProjectResponse.status === 400) {
                console.log("Something wrong! Got a status 400", editProjectResponse.responseBody);
                yield put(editProjectFailure(editProjectResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", editProjectResponse);
                yield put(editProjectFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("edit Project failed by api. No response !");
            yield put(editProjectFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("edit Project failed by api. Error => ", err);
        yield put(editProjectFailure({ detail: [err.detail] }));
    }
};


const tryDiscardProjectSaga = function* (action) {
    try {
        const { project_id } = action.payload;

        const discardProjectResponse = yield call(api.discardProject, project_id);

        if (discardProjectResponse) {
            console.log("discardProjectResponse", discardProjectResponse);

            if (discardProjectResponse.status === 200) {
                yield put(discardProjectSuccess(discardProjectResponse.responseBody));
            } else if (discardProjectResponse.status === 400) {
                console.log("Something wrong! Got a status 400", discardProjectResponse.responseBody);
                yield put(discardProjectFailure(discardProjectResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", discardProjectResponse);
                yield put(discardProjectFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("discard Project failed by api. No response !");
            yield put(discardProjectFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("discard Project failed by api. Error => ", err);
        yield put(discardProjectFailure({ detail: [err.detail] }));
    }
};

const tryCreateBidSaga = function* (action) {
    try {
        const { project_id, freelancer_id, offer, note } = action.payload;

        const createBidResponse = yield call(api.createBid, project_id, freelancer_id, offer, note);

        if (createBidResponse) {
            console.log("createBidResponse", createBidResponse);

            if (createBidResponse.status === 200) {
                yield put(createBidSuccess(createBidResponse.responseBody));
            } else if (createBidResponse.status === 400) {
                console.log("Something wrong! Got a status 400", createBidResponse.responseBody);
                yield put(createBidFailure(createBidResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", createBidResponse);
                yield put(createBidFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Create Bid failed by api. No response !");
            yield put(createBidFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Create Bid failed by api. Error => ", err);
        yield put(createBidFailure({ detail: [err.detail] }));
    }
};

const saga = function* () {
    // AUTH
    yield takeLatest(LOGIN_REQUEST, tryLoginSaga);
    yield takeLatest(REGISTER_REQUEST, tryRegisterSaga);
    yield takeLatest(LOGOUT_REQUEST, tryLogout);

    // USER
    yield takeLatest(GET_PROFILE_REQUEST, tryGetProfileSaga);
    yield takeLatest(GET_USER_PROFILE_REQUEST, tryGetUserProfileSaga);
    yield takeLatest(UPDATE_PROFILE_REQUEST, tryUpdateProfileSaga);
    yield takeLatest(CHANGE_PASSWORD_REQUEST, tryChangePasswordSaga);

    // PROJECTS
    yield takeLatest(GET_PROJECTS_REQUEST, tryGetProjectsSaga);
    yield takeLatest(GET_PROJECT_REQUEST, tryGetProjectSaga);
    yield takeLatest(GET_OWN_PROJECTS_REQUEST, tryGetOwnProjectsSaga);
    yield takeLatest(CREATE_PROJECT_REQUEST, tryCreateProjectSaga);
    yield takeLatest(EDIT_PROJECT_REQUEST, tryEditProjectSaga);
    yield takeLatest(DISCARD_PROJECT_REQUEST, tryDiscardProjectSaga);

    // BIDS
    yield takeLatest(CREATE_BID_REQUEST, tryCreateBidSaga);
};

export default saga;
