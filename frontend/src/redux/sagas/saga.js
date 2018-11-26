import {call, put, takeLatest} from "redux-saga/effects";

import {LOGIN_REQUEST, LOGOUT_REQUEST, REGISTER_REQUEST} from "../auth/actionTypes";
import {
    CHANGE_PASSWORD_REQUEST, 
    GET_PROFILE_REQUEST, 
    GET_USER_PROFILE_REQUEST, 
    UPDATE_PROFILE_REQUEST,
    GET_PORTFOLIO_REQUEST,
    POST_PORTFOLIO_REQUEST,
    PUT_PORTFOLIO_REQUEST,
    DELETE_PORTFOLIO_REQUEST,
} from "../user/actionTypes";
import { 
    CREATE_PROJECT_REQUEST, 
    EDIT_PROJECT_REQUEST, 
    DISCARD_PROJECT_REQUEST, 
    FINISH_PROJECT_REQUEST, 
    GET_PROJECTS_REQUEST, 
    GET_PROJECT_REQUEST, 
    DELETE_PROJECT_REQUEST, 
    GET_OWN_PROJECTS_REQUEST,
    CREATE_BID_REQUEST,
    ACCEPT_BID_REQUEST,
    DISCARD_BID_REQUEST, 
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
    finishProjectSuccess,
    finishProjectFailure,
    deleteProjectSuccess,
    deleteProjectFailure,
    getOwnProjectsFailure, 
    getOwnProjectsSuccess,
    createBidSuccess,
    createBidFailure,
    acceptBidSuccess,
    acceptBidFailure,
    discardBidSuccess,
    discardBidFailure,
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
    updateProfileSuccess,
    getPortfolioFailure,
    getPortfolioSuccess,
    postPortfolioSuccess,
    postPortfolioFailure,
    putPortfolioSuccess,
    putPortfolioFailure,
    deletePortfolioFailure,
    deletePortfolioSuccess
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

const tryFinishProjectSaga = function* (action) {
    try {
        const { project_id } = action.payload;

        const finishProjectResponse = yield call(api.finishProject, project_id);

        if (finishProjectResponse) {
            console.log("finishProjectResponse", finishProjectResponse);

            if (finishProjectResponse.status === 200) {
                yield put(finishProjectSuccess(finishProjectResponse.responseBody));
            } else if (finishProjectResponse.status === 400) {
                console.log("Something wrong! Got a status 400", finishProjectResponse.responseBody);
                yield put(finishProjectFailure(finishProjectResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", finishProjectResponse);
                yield put(finishProjectFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("finish Project failed by api. No response !");
            yield put(finishProjectFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("finish Project failed by api. Error => ", err);
        yield put(finishProjectFailure({ detail: [err.detail] }));
    }
};

const tryDeleteProjectSaga = function* (action) {
    try {
        const { project_id } = action.payload;

        const deleteProjectResponse = yield call(api.deleteProject, project_id);

        if (deleteProjectResponse) {
            console.log("deleteProjectResponse", deleteProjectResponse);

            if (deleteProjectResponse.status === 200) {
                yield put(deleteProjectSuccess(deleteProjectResponse.responseBody));
            } else if (deleteProjectResponse.status === 400) {
                console.log("Something wrong! Got a status 400", deleteProjectResponse.responseBody);
                yield put(deleteProjectFailure(deleteProjectResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", deleteProjectResponse);
                yield put(deleteProjectFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("delete Project failed by api. No response !");
            yield put(deleteProjectFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("delete Project failed by api. Error => ", err);
        yield put(deleteProjectFailure({ detail: [err.detail] }));
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

const tryAcceptBidSaga = function* (action) {
    try {
        const { bid_id } = action.payload;

        const acceptBidResponse = yield call(api.acceptBid, bid_id);

        if (acceptBidResponse) {
            console.log("acceptBidResponse", acceptBidResponse);

            if (acceptBidResponse.status === 200) {
                yield put(acceptBidSuccess(acceptBidResponse.responseBody));
            } else if (acceptBidResponse.status === 400) {
                console.log("Something wrong! Got a status 400", acceptBidResponse.responseBody);
                yield put(acceptBidFailure(acceptBidResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", acceptBidResponse);
                yield put(acceptBidFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("accept Bid failed by api. No response !");
            yield put(acceptBidFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("accept Bid failed by api. Error => ", err);
        yield put(acceptBidFailure({ detail: [err.detail] }));
    }
};

const tryDiscardBidSaga = function* (action) {
    try {
        const { bid_id } = action.payload;

        const discardBidResponse = yield call(api.discardBid, bid_id);

        if (discardBidResponse) {
            console.log("discardBidResponse", discardBidResponse);

            if (discardBidResponse.status === 200) {
                yield put(discardBidSuccess(discardBidResponse.responseBody));
            } else if (discardBidResponse.status === 400) {
                console.log("Something wrong! Got a status 400", discardBidResponse.responseBody);
                yield put(discardBidFailure(discardBidResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", discardBidResponse);
                yield put(discardBidFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("discard Bid failed by api. No response !");
            yield put(discardBidFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("discard Bid failed by api. Error => ", err);
        yield put(discardBidFailure({ detail: [err.detail] }));
    }
};

const tryGetPortfolioSaga = function* (action) {
    try {
        const { portfolio_id } = action.payload;

        const getPortfolioResponse = yield call(api.getPortfolio, portfolio_id);

        if (getPortfolioResponse) {
            console.log("getPortfolioResponse", getPortfolioResponse);

            if (getPortfolioResponse.status === 200) {
                yield put(getPortfolioSuccess(getPortfolioResponse.responseBody));
            } else if (getPortfolioResponse.status === 400) {
                console.log("Something wrong! Got a status 400", getPortfolioResponse.responseBody);
                yield put(getPortfolioFailure(getPortfolioResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", getPortfolioResponse);
                yield put(getPortfolioFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("get Portfolio failed by api. No response !");
            yield put(getPortfolioFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("get Portfolio failed by api. Error => ", err);
        yield put(getPortfolioFailure({ detail: [err.detail] }));
    }
};

const tryDeletePortfolioSaga = function* (action) {
    try {
        const { portfolio_id } = action.payload;

        const deletePortfolioResponse = yield call(api.deletePortfolio, portfolio_id);

        if (deletePortfolioResponse) {
            console.log("deletePortfolioResponse", deletePortfolioResponse);

            if (deletePortfolioResponse.status === 200) {
                yield put(deletePortfolioSuccess(deletePortfolioResponse.responseBody));
            } else if (deletePortfolioResponse.status === 400) {
                console.log("Something wrong! Got a status 400", deletePortfolioResponse.responseBody);
                yield put(deletePortfolioFailure(deletePortfolioResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", deletePortfolioResponse);
                yield put(deletePortfolioFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("delete Portfolio failed by api. No response !");
            yield put(deletePortfolioFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("delete Portfolio failed by api. Error => ", err);
        yield put(deletePortfolioFailure({ detail: [err.detail] }));
    }
};

const tryPostPortfolioSaga = function* (action) {
    try {
        const { title, description, date, project_id } = action.payload;

        const postPortfolioResponse = yield call(api.postPortfolio, title, description, date, project_id);

        if (postPortfolioResponse) {
            console.log("postPortfolioResponse", postPortfolioResponse);

            if (postPortfolioResponse.status === 200) {
                yield put(postPortfolioSuccess(postPortfolioResponse.responseBody));
            } else if (postPortfolioResponse.status === 400) {
                console.log("Something wrong! Got a status 400", postPortfolioResponse.responseBody);
                yield put(postPortfolioFailure(postPortfolioResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", postPortfolioResponse);
                yield put(postPortfolioFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("post Portfolio failed by api. No response !");
            yield put(postPortfolioFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("post Portfolio failed by api. Error => ", err);
        yield put(postPortfolioFailure({ detail: [err.detail] }));
    }
};

const tryPutPortfolioSaga = function* (action) {
    try {
        const { portfolio_id, title, description, date, project_id } = action.payload;

        const putPortfolioResponse = yield call(api.putPortfolio, portfolio_id, title, description, date, project_id);

        if (putPortfolioResponse) {
            console.log("putPortfolioResponse", putPortfolioResponse);

            if (putPortfolioResponse.status === 200) {
                yield put(putPortfolioSuccess(putPortfolioResponse.responseBody));
            } else if (putPortfolioResponse.status === 400) {
                console.log("Something wrong! Got a status 400", putPortfolioResponse.responseBody);
                yield put(putPortfolioFailure(putPortfolioResponse.responseBody));
            } else {
                console.log("Something wrong! Got an unknown status.", putPortfolioResponse);
                yield put(putPortfolioFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("put Portfolio failed by api. No response !");
            yield put(putPortfolioFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("put Portfolio failed by api. Error => ", err);
        yield put(putPortfolioFailure({ detail: [err.detail] }));
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
    yield takeLatest(FINISH_PROJECT_REQUEST, tryFinishProjectSaga);
    yield takeLatest(DELETE_PROJECT_REQUEST, tryDeleteProjectSaga);

    // BIDS
    yield takeLatest(CREATE_BID_REQUEST, tryCreateBidSaga);
    yield takeLatest(DISCARD_BID_REQUEST, tryDiscardBidSaga);
    yield takeLatest(ACCEPT_BID_REQUEST, tryAcceptBidSaga);

    // PORTFOLIO
    yield takeLatest(GET_PORTFOLIO_REQUEST, tryGetPortfolioSaga);
    yield takeLatest(POST_PORTFOLIO_REQUEST, tryPostPortfolioSaga);
    yield takeLatest(PUT_PORTFOLIO_REQUEST, tryPutPortfolioSaga);
    yield takeLatest(DELETE_PORTFOLIO_REQUEST, tryDeletePortfolioSaga);
};

export default saga;
