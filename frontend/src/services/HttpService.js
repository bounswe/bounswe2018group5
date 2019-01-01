import { getCookie, TOKEN_COOKIE } from "./cookies.js";

const Configuration = {
    API_URL: process.env.REACT_APP_API_URL,
    STATIC_HOST: process.env.REACT_APP_API_STATIC_URL,
    HTTP_TIMEOUT_MS: 40000 /* 40 sec */
};

class HttpService {
    fetch(requestOptions) {
        return new Promise((resolve, reject) => {
            const url = this._createUrl(requestOptions);
            const overriddenHeaders = requestOptions.headers || {};
            const sendToken = requestOptions.sendToken || false;
            const api_token = getCookie(TOKEN_COOKIE) ? getCookie(TOKEN_COOKIE)  : null;
            let headers;
            if (sendToken) {
                headers = {
                    "Content-Type": "application/json",
                        Authorization:
                    typeof sendToken === "undefined"
                        ? api_token
                        : sendToken === false
                            ? null
                            : api_token,
                    ...overriddenHeaders
                };
            } else {
                headers = {
                    "Content-Type": "application/json",
                    ...overriddenHeaders
                };
            }
            const processedRequestOptions = {
                ...requestOptions,
                body: JSON.stringify(requestOptions.body),
                headers: headers,
                timeout: Configuration.HTTP_TIMEOUT_MS,
            };

            let fetchStatus = null;

            fetch(url, processedRequestOptions)
                .then(fetchRes => {
                    fetchStatus = fetchRes.status;
                    return fetchRes.json();
                })
                .then(res => {
                    const response = {
                        status: fetchStatus,
                        responseBody: res
                    };
                    resolve(response);
                    return response;
                })
                .catch(err => {
                    console.log("HttpService.js:", err);
                    reject({
                        detail: "Something wrong happened when try to fetch data. Code-API"
                    });
                });
        });
    }

    _buildUrl (base, key, value) {
        var sep = (base.indexOf('?') > -1) ? '&' : '?';
        return base + sep + key + '=' + value;
    }

    _createUrl(requestOptions) {
        let url = requestOptions.apiPath || Configuration.API_URL;
        url = requestOptions.path ? url + requestOptions.path : url;
        if (requestOptions.params) {
            for (var key in requestOptions.params) {
                url = this._buildUrl(url, key, requestOptions.params[key]);
            };
        }
        return url;
    }
}

export default new HttpService();