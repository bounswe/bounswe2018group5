import httpService from "services/HttpService";

class api {
    doLogin = (username, password) => {
        return httpService.fetch({
            path: "api/user/auth/login",
            method: "POST",
            body: {
                username,
                password
            },
            sendToken: false
        });
    };
    doRegister = (username, email, password, full_name) => {
        return httpService.fetch({
            path: "api/user/auth/register",
            method: "POST",
            body: {
                username,
                email,
                password,
                full_name
            },
            sendToken: false
        });
    };
    doLogout = () => {
        return httpService.fetch({
            path: "api/user/auth/logout",
            method: "GET",
            sendToken: true
        });
    };
    getProfile = () => {
        return httpService.fetch({
            path: "api/user/profile/",
            method: "GET",
            sendToken: true
        });
    };
    getUserProfile = (user_id) => {
        return httpService.fetch({
            path: "api/user/profile/" + user_id + "/",
            method: "GET",
            sendToken: true
        });
    };
    changePassword = (password) => {
        return httpService.fetch({
            path: "api/user/profile/update",
            method: "POST",
            body: {
                password
            },
            sendToken: true
        });
    };
    updateProfile = (full_name, gender, bio, type) => {
        return httpService.fetch({
            path: "api/user/profile/update",
            method: "POST",
            body: {
                full_name,
                gender,
                bio,
                type
            },
            sendToken: true
        });
    };
    getProjects = () => {
        return httpService.fetch({
            path: "api/project/get/all",
            method: "GET",
            sendToken: true
        });
    };
    getOwnProjects = () => {
        return httpService.fetch({
            path: "api/project/get/own",
            method: "GET",
            sendToken: true
        });
    };
    createProject = (title, description, project_deadline, budget) => {
        return httpService.fetch({
            path: "api/project/create",
            method: "POST",
            body: {
                title,
                description,
                project_deadline,
                budget
            },
            sendToken: true
        });
    };
    editProject = (project_id, description) => {
        return httpService.fetch({
            path: "api/project/update/",
            method: "POST",
            body: {
                project_id,
                description
            },
            sendToken: true
        });
    };
    discardProject = (project_id) => {
        return httpService.fetch({
            path: "api/project/discard",
            method: "POST",
            body: {
                project_ids: [project_id]
            },
            sendToken: true
        });
    };
}

export default new api();
