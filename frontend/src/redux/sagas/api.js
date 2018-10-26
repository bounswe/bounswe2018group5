import httpService from "services/HttpService";

class api {
    doLogin = (email, password) => {
        return httpService.fetch({
            path: "api/v1/login/",
            method: "POST",
            body: {
                email,
                password
            },
            sendToken: false
        });
    };
    doRegister = (username, email, password, password_confirmation, full_name) => {
        return httpService.fetch({
            path: "api/v1/register/",
            method: "POST",
            body: {
                username,
                email,
                password,
                password_confirmation,
                full_name
            },
            sendToken: false
        });
    };
}

export default new api();
