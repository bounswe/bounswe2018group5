import React from "react";
import PropTypes from 'prop-types'

import Button from "material-dashboard-react/dist/components/CustomButtons/Button";

class LinkedIn extends React.Component {
    static propTypes = {
        clientId: PropTypes.string.isRequired,
        callBack: PropTypes.func.isRequired,
        fields: PropTypes.string.isRequired,
        className: PropTypes.string,
        loginButtonText: PropTypes.string,
        logoutButtonText: PropTypes.string,
        buttonType: PropTypes.string,
        icon: PropTypes.object,
        getOAuthToken: PropTypes.bool,
    }

    state = {
        loading: false,
        isLoggedIn: false
    }

    static defaultProps = {
        loginButtonText: 'Login with Linkedin',
        logoutButtonText: 'Logout from Linkedin',
        buttonType: 'button',
        className: 'linkedin-sdk',
        getOAuthToken: false,
    }

    componentDidMount() {
        if (typeof window === 'undefined') {
            return
        }

        const { clientId } = this.props
        this.loadSDK(clientId)
    }

    loadSDK = clientId => {
        ; ((d, s, id) => {
            const element = d.getElementsByTagName(s)[0]
            const ljs = element
            let js = element
            if (d.getElementById(id)) {
                return
            }
            js = d.createElement(s)
            js.id = id
            js.src = `//platform.linkedin.com/in.js`
            js.text = `api_key: ${clientId}`
            ljs.parentNode.insertBefore(js, ljs)
        })(document, 'script', 'linkedin-jssdk')
    }

    callBack = () => {
        this.setState({ loading: true })
        const { fields, callBack, getOAuthToken } = this.props
        const { isLoggedIn } = this.state

        if (window.IN['User'] && isLoggedIn) {
            this.setState({ loading: false, isLoggedIn: false })
            return callBack('logout')
        }
        window.IN.API.Raw(`/people/~${fields}`).result(r => {
            this.setState({ loading: false, isLoggedIn: true })
            const response = { ...r }
            if (getOAuthToken) response.oauthToken = window.IN.ENV.auth.oauth_token
            callBack(response)
        })
    }

    handleAuthorization = e => {
        if (window.IN.User.isAuthorized()) {
            return window.IN.User.logout(this.callBack, '')
        }
        return window.IN.User.authorize(this.callBack, '')
    }

    render() {
        return (
            <Button
                onClick={this.handleAuthorization}
                justIcon round color="success"
            >
                <i
                    className={"fab fa-linkedin"}
                />
            </Button>
        )
    }

}

export default LinkedIn;