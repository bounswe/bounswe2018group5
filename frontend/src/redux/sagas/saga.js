import { call, put, takeLatest } from "redux-saga/effects";

import {LOGIN_REQUEST, LOGOUT_REQUEST, REGISTER_REQUEST} from "../auth/actionTypes";
import {GET_PROFILE_REQUEST} from "../user/actionTypes";
import { loginSuccess, loginFailure, registerFailure, registerSuccess } from "../auth/Actions";
import { profileSuccess, profileFailure } from "../user/Actions";

import api from "./api";

const tryLoginSaga = function*(action) {
    const { username, password } = action.payload;

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
                yield put(loginFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Login failed by api. No response !");
            yield put(loginFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Login failed by api. Error => ", err);
        yield put(loginFailure({ detail: [err.detail] }));
    }
};

const tryRegisterSaga = function*(action) {
    const { username, email, password, full_name } = action.payload;

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
                yield put(registerFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Register failed by api. No response !");
            yield put(registerFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Register failed by api. Error => ", err);
        yield put(registerFailure({ detail: [err.detail] }));
    }
};

const tryLogout = function*() {
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

const tryGetProfileSaga = function*() {
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
                yield put(profileFailure({ detail: ["Unknown status. Check console!"] }));
            }
        } else {
            console.log("Get Profile failed by api. No response !");
            yield put(profileFailure({ detail: ["No response fetched. Please contact the API team!"] }));
        }
    } catch (err) {
        console.log("Get Profile failed by api. Error => ", err);
        yield put(profileFailure({ detail: [err.detail] }));
    }
};

const saga = function*() {
    // AUTH
    yield takeLatest(LOGIN_REQUEST, tryLoginSaga);
    yield takeLatest(REGISTER_REQUEST, tryRegisterSaga);
    yield takeLatest(LOGOUT_REQUEST, tryLogout);

    // USER
    yield takeLatest(GET_PROFILE_REQUEST, tryGetProfileSaga);
};

export default saga;
