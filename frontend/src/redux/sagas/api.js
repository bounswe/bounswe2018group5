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
            path: "api/user/profile/",
            params: {
                user_id
            },
            method: "GET",
            sendToken: true
        });
    };

    changePassword = (password) => {
        return httpService.fetch({
            path: "api/user/profile/",
            method: "PUT",
            body: {
                password
            },
            sendToken: true
        });
    };

    updateProfile = (full_name, gender, bio, type) => {
        return httpService.fetch({
            path: "api/user/profile/",
            method: "PUT",
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
            path: "api/project/",
            method: "GET",
            sendToken: false
        });
    };

    getRecommendedProjects = (user_id) => {
        return httpService.fetch({
            path: "api/recommend/",
            method: "GET",
            params: {
                id: user_id
            },
            sendToken: true
        });
    };

    searchProjects = (query) => {
        return httpService.fetch({
            path: "api/project/search/",
            method: "GET",
            params: {
                query
            },
            sendToken: true
        });
    };

    getProject = (project_id) => {
        return httpService.fetch({
            path: "api/project/",
            method: "GET",
            params: {
                ids: project_id
            },
            sendToken: false
        });
    };

    getOwnProjects = () => {
        return httpService.fetch({
            path: "api/project/own/",
            method: "GET",
            sendToken: true
        });
    };

    createProject = (title, description, project_deadline, budget, milestones, tags) => {
        return httpService.fetch({
            path: "api/project/",
            method: "POST",
            body: {
                title,
                description,
                project_deadline,
                budget,
                milestones,
                tags
            },
            sendToken: true
        });
    };

    editProject = (project_id, description, milestones, title, budget) => {
        return httpService.fetch({
            path: "api/project/",
            method: "PUT",
            body: {
                project_id,
                description,
                milestones, 
                title, 
                budget
            },
            sendToken: true
        });
    };

    discardProject = (project_id) => {
        return httpService.fetch({
            path: "api/project/",
            method: "PUT",
            body: {
                project_id,
                status: -1
            },
            sendToken: true
        });
    };

    finishProject = (project_id) => {
        return httpService.fetch({
            path: "api/project/finish/",
            method: "PUT",
            body: {
                project_id,
            },
            sendToken: true
        });
    };

    deleteProject = (project_id) => {
        return httpService.fetch({
            path: "api/project/",
            method: "DELETE",
            params: {
                id: project_id
            },
            sendToken: true
        });
    };

    rateProject = (project_id, comment, value) => {
        return httpService.fetch({
            path: "api/user/rating/",
            method: "POST",
            body: {
                project_id, 
                comment, 
                value
            },
            sendToken: true
        });
    };

    createBid = (project_id, freelancer_id, offer, note) => {
        return httpService.fetch({
            path: "api/project/bid/add/",
            method: "POST",
            body: {
                project_id,
                freelancer: freelancer_id,
                offer,
                note
            },
            sendToken: true
        });
    };

    acceptBid = (bid_id) => {
        return httpService.fetch({
            path: "api/project/bid/accept/",
            method: "POST",
            body: {
                bid_id
            },
            sendToken: true
        });
    };

    discardBid = (bid_id) => {
        return httpService.fetch({
            path: "api/project/bid/discard/",
            method: "POST",
            body: {
                bid_id
            },
            sendToken: true
        });
    };

    getPortfolio = (portfolio_id) => {
        return httpService.fetch({
            path: "api/user/portfolio/",
            method: "GET",
            params: {
                id: portfolio_id
            },
            sendToken: true
        });
    };

    postPortfolio = (title, description, date, project_id, tags) => {
        return httpService.fetch({
            path: "api/user/portfolio/",
            method: "POST",
            body: {
                title,
                description,
                date,
                project_id,
                tags
            },
            sendToken: true
        });
    };

    putPortfolio = (portfolio_id, title, description, date, project_id) => {
        return httpService.fetch({
            path: "api/user/portfolio/",
            method: "PUT",
            body: {
                portfolio_id,
                title,
                description,
                date,
                project_id
            },
            sendToken: true
        });
    };

    deletePortfolio = (portfolio_id) => {
        return httpService.fetch({
            path: "api/user/portfolio/",
            method: "DELETE",
            params: {
                id: portfolio_id
            },
            sendToken: true
        });
    };

    putWallet = (deposit, withdraw) => {
        return httpService.fetch({
            path: "api/user/wallet/",
            method: "PUT",
            body: {
                deposit,
                withdraw,
            },
            sendToken: true
        });
    };

    getTags = (tags) => {
        return httpService.fetch({
            path: "api/tag/",
            method: "GET",
            params: {
                ids: tags
            },
            sendToken: true
        });
    };
}

export default new api();
