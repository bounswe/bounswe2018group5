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
            path: "api/user/profile",
            method: "GET",
            sendToken: true
        });
    };
}

export default new api();
