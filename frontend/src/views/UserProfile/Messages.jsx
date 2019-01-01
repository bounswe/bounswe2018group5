import React, { Component } from 'react';
import Helmet from "react-helmet";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import 'react-chat-elements/dist/main.css';

import connect from "react-redux/es/connect/connect";

import { tryGetConversations, conversationsReset, tryGetConversation, conversationReset, trySendMessage, sendMessageReset } from "redux/user/Actions.js";

import {
    ChatList,
    MessageList,
    Input,
    Button,
    SideBar,
    Popup,
} from 'react-chat-elements';

import FaClose from 'react-icons/lib/fa/close';

import messageStyle from "views/UserProfile/messages.css";

import { getCookie, LOGGEDIN_USERID_COOKIE } from "services/cookies";

import default_image from "assets/img/faces/default_image.png";

class Messages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: true,
            conversations: [],
            conversation: {
                messages: [],
                user1: {},
                user2: {}
            },
            user_id: getCookie(LOGGEDIN_USERID_COOKIE),
            receiver_id: null,
            message: "",
            user_profile_image: default_image
        };

        this.conversationOnClick = this.conversationOnClick.bind(this);
    }

    componentDidMount() {
        this.props.tryGetConversations();
    }

    componentDidUpdate(prevProps, prevState) {
        const { getConversationsInProgress, getConversationsHasError, getConversationsCompleted, conversations } = this.props.user;

        if (!getConversationsInProgress && !getConversationsHasError && getConversationsCompleted) {
            this.setState({ conversations });
            this.props.conversationsReset();
        }

        const { getConversationInProgress, getConversationHasError, getConversationCompleted, conversation } = this.props.user;

        if (!getConversationInProgress && !getConversationHasError && getConversationCompleted) {
            this.setState({ conversation });
            this.props.conversationReset();
        }

        const { sendMessageInProgress, sendMessageHasError, sendMessageCompleted, response } = this.props.user;

        if (!sendMessageInProgress && !sendMessageHasError && sendMessageCompleted) {
            if(response) {
                this.state.conversation.messages.push({
                    body: this.state.message,
                    receiver: {id: this.state.receiver_id},
                    sender: {id: this.state.user_id, profile_image: this.state.user_profile_image}
                });
                this.setState({message: ""});
                this.props.sendMessageReset();
            }            
        }
    }

    conversationOnClick(conversation) {
        this.setState({ receiver_id: conversation.id });
        if (conversation.profile_image) this.setState({ user_profile_image: conversation.profile_image });
        this.props.tryGetConversation(conversation.id);
    }

    addMessage() {
        this.props.trySendMessage(this.state.receiver_id, this.state.message);
    }

    render() {
        const { conversations, conversation } = this.state;

        var chatSource = conversations.map((prop, key) => {
            let user = prop.user1, me = prop.user2;
            if (this.state.user_id === prop.user1.id) user = prop.user2;
            if (this.state.user_id === prop.user1.id) me = prop.user1;

            let lastMessage = prop.messages.slice(-1)[0];
            return {
                id: user.id,
                avatar: user.profile_image ? process.env.REACT_APP_API_STATIC_URL + "profile_images/" + user.profile_image : default_image,
                avatarFlexible: true,
                title: user.username,
                subtitle: lastMessage.body,
                date: null,
                profile_image: me.profile_image
            };
        });

        var messageList = conversation.messages.map((prop, key) => {
            return {
                position: (prop.sender.id === this.state.user_id ? 'right' : 'left'),
                theme: 'white',
                view: 'list',
                text: prop.body,
                date: null,
                avatar: prop.sender.profile_image ? process.env.REACT_APP_API_STATIC_URL + "profile_images/" + prop.sender.profile_image : default_image,
            };
        });
    
        return (
            <div className='container'>
                <Helmet
                    title='Messages'
                    meta={[
                        { property: 'og:title', content: 'Messages' },
                    ]} />
                <div
                    className='chat-list'>
                    <SideBar
                        top={
                            <Popup
                                // show={this.state.show}
                                header='Lorem ipsum dolor sit amet.'
                                headerButtons={[{
                                    type: 'transparent',
                                    color: 'black',
                                    onClick: () => {
                                        this.setState({ show: false })
                                    },
                                    icon: {
                                        component: <FaClose />,
                                        size: 18
                                    }
                                }]}
                                text='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem animi veniam voluptas eius!'
                                footerButtons={[{
                                    color: 'white',
                                    backgroundColor: '#ff5e3e',
                                    text: "Vazgeç",
                                }, {
                                    color: 'white',
                                    backgroundColor: 'lightgreen',
                                    text: "Tamam",
                                }]} />
                        }
                        center={
                            <ChatList
                                dataSource={chatSource} 
                                onClick={this.conversationOnClick}/>
                        }
                    />
                </div>
                <div
                    className='right-panel'>
                    <MessageList
                        className='message-list'
                        lockable={true}
                        downButtonBadge={10}
                        dataSource={messageList} />

                    <Input
                        placeholder="Mesajınızı buraya yazınız."
                        defaultValue={this.state.message}
                        ref='input'
                        multiline={true}
                        onChange={event => this.setState({ message: event.target.value })}
                        // buttonsFloat='left'
                        onKeyPress={(e) => {
                            if (e.shiftKey && e.charCode === 13) {
                                return true;
                            }
                            if (e.charCode === 13) {
                                this.addMessage();
                                e.preventDefault();
                                return false;
                            }
                        }}
                        rightButtons={
                            <Button
                                text='Gönder'
                                onClick={this.addMessage.bind(this)} />
                        } />
                </div>
            </div>
        );
    }
}

function bindAction(dispatch) {
    return {
        tryGetConversations: () => dispatch(tryGetConversations()),
        conversationsReset: () => dispatch(conversationsReset()),
        tryGetConversation: (user_id) => dispatch(tryGetConversation(user_id)),
        conversationReset: () => dispatch(conversationReset()),
        trySendMessage: (user_id, message) => dispatch(trySendMessage(user_id, message)),
        sendMessageReset: () => dispatch(sendMessageReset()),
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(messageStyle)(Messages));