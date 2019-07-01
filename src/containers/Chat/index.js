import React, { Component } from "react";
import PropTypes from "prop-types";
import { ButtonIcon, History, Typography, InputText, Button, DropDownField } from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import _ from 'lodash';
import UsersGroupIcon from 'mdi-react/UsersGroupIcon';
import { Row, Col } from 'reactstrap';
import "./index.css";
import { MenuItem } from '@material-ui/core';
import languages from "../../config/languages";
import { setMessageNotification } from "../../redux/actions/message";
import { CopyText } from "../../copy";
import store from "../App/store";

const sound = localStorage.getItem("sound");

const defaultProps = {
    messages : [],
    soundMode: sound || "off",
    options: null,
    game: null,
    message : '',
    participants : 0,
    open : true,
    history: ""
}

class ChatPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  ...defaultProps };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    projectData = async (props) => {
        
        if(props.chat.messages.length >= 1){
            this.setState({...this.state,
                participants : props.chat.participants,
                messages :  props.chat.messages,
                open :  props.chat.open
            });
            this.scrollToBottom();
        }
    }

    sendMessage = async (e) => {
        e.preventDefault();
        if(_.isEmpty(this.props.profile)){
            console.log("ieuheuir")
            await store.dispatch(setMessageNotification(CopyText.ERRORS.CHAT_USER_NOT_LOGGED));
        }
        this.scrollToBottom();
        try{
            await this.props.profile.sendMessage({message : this.state.message})
            this.scrollToBottom();
            this.setState({...this.state, message : ''})
        }catch(err){
            this.setState({...this.state, message : ''})
        }
    }

    createMessageBox = ({username, message, id}) => {
        return(
            <div styleName='message-box' key={id}>
                <div style={{float : 'left', marginRight : 10}}>
                    <Typography variant="small-body" color="casper"> 
                        {username} 
                    </Typography>
                  
                </div> 
                <div style={{marginLeft : 10}}>
                    <Typography variant="small-body" color="white">
                        {message}
                    </Typography>
                </div>
            </div>
        )
    }

    changeLanguage = (item) => {
        // TO DO : 
        console.log(item);
    }

    changeMessage = event => {
        this.setState({ message: event.target.value });
    };

    render() {
        return (
            <div styleName="root">
                    <div styleName="container">
                        <div ref={el => { this.el = el; }} styleName="text-container">
                            {this.state.messages.map((item) => {
                                return this.createMessageBox({username : item._sender.nickname, message : item.message, id : item.messageId})
                            })}
                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </div>
                        <div styleName="message-container">
                            <form onSubmit={this.sendMessage}>
                                <InputText
                                    name="text"
                                    placeholder='Type your Message'
                                    onChange={this.changeMessage}
                                    value={this.state.message}
                                    type={'slim'}
                                />
                                <div styleName='container-box'>
                                    <Row>
                                    
                                        <Col sm={2}>
                                            {this.state.open ? 
                                                <div styleName={'green-light'}/>
                                            :
                                                <div styleName={'red-light'}/>
                                            }

                                        </Col>
                                        <Col sm={2}>
                                            <div style={{marginTop : -18}}>
                                                <DropDownField
                                                    id="language"
                                                    type={'language'}
                                                    onChange={this.changeLanguage}
                                                    options={languages}
                                                    value={languages[0]}
                                                    style={{width : '80%'}}
                                                    label="Language Name"
                                                    >
                                                    {languages.map(option => (
                                                        <MenuItem key={option} value={option}>
                                                            <img src={option.image} styleName='image-language'/>
                                                        </MenuItem>
                                                    ))}
                                                </DropDownField> 
                                            </div>
                                        </Col>
                                        <Col sm={4} lg={3}>
                                            <div styleName={'users-box'}>
                                                <Typography weight="body" color="casper">
                                                    {this.state.participants} <UsersGroupIcon size={25}/>
                                                </Typography>
                                            </div>
                                        </Col>
                                        <Col sm={4} lg={4}>
                                            <button
                                                disabled={this.state.message.length < 1}
                                                type="submit"
                                                styleName="button"
                                            >
                                                <Typography weight="small-body" color="white">
                                                    Send
                                                </Typography>
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </form>
                        </div>
                    </div>
            </div>
        );
    }
}




function mapStateToProps(state){
    return {
        profile: state.profile,
        chat : state.chat
    };
}


export default connect(mapStateToProps)(ChatPage);
