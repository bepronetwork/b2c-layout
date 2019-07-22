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
import { dateToHourAndMinute } from "../../lib/helpers";

const sound = localStorage.getItem("sound");

const defaultProps = {
    messages : [],
    soundMode: sound || "off",
    options: null,
    game: null,
    message : '',
    participants : 0,
    open : true,
    history: "",
    language : languages[0]
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
        if(props.chat.messages.length > 0){
            let currentMessages = this.state.messages;
            this.setState({...this.state,
                participants : props.chat.participants,
                messages :  props.chat.messages,
                name : props.chat.name,
                open :  props.chat.open
            });

            if((currentMessages.length > 0) 
            &&  (props.chat.messages.length > 0) 
            &&  (props.chat.messages[props.chat.messages.length-1].id != currentMessages[currentMessages.length-1].id)){
                console.log("Scolling")
                this.scrollToBottom();
            }
        }
    }

    sendMessage = async (e) => {
        e.preventDefault();
        if(_.isEmpty(this.props.profile)){
            await store.dispatch(setMessageNotification(CopyText.Errors.en.CHAT_USER_NOT_LOGGED));
        }
        try{
            await this.props.profile.sendMessage({message : this.state.message});
            this.projectData(this.props);

        }catch(err){
            console.log(err)
            this.setState({...this.state, message : ''})
        }
    }

    createMessageBox = ({username, message, id, time}) => {
        
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
                <div>
                    <Typography variant="x-small-body" color="grey"> 
                        {dateToHourAndMinute(time)} 
                    </Typography>
                </div>
            </div>
        )
    }

    changeLanguage = async (item) => {
        item = languages.find( a => {
            if(a.channel_id == item.value){
                return a;
            }
        })
        let { profile } = this.props;
        profile.getChat().changeLanguage({language : item.name, channel_id : item.channel_id});
        this.setState({...this.state, language : item.channel_id})
    }

    changeMessage = event => {
        this.setState({ message: event.target.value });
    };

    render() {
        const { ln } = this.props;
        const copy = CopyText.shared[ln];
        return (
            <div styleName="root">
                    <div styleName="container">
                        <div ref={el => { this.el = el; }} styleName="text-container">
                            {this.state.messages.map((item) => {
                                return this.createMessageBox({username : item.user ? item.user.displayName : 'none', message : item.text, id : item.id, time : new Date(item.insertedAt*1000)})
                            })}
                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </div>
                        <div styleName="message-container">
                            <form onSubmit={this.sendMessage}>
                                <InputText
                                    name="text"
                                    placeholder={copy.PLACEHOLDER_CHAT}
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
                                                    value={this.state.language.channel_id}
                                                    style={{width : '80%'}}
                                                    label="Language Name"
                                                    >
                                                    {languages.map(option => (
                                                        <MenuItem key={option.channel_id} value={option.channel_id}>
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
        chat : state.chat,
        ln : state.language
    };
}


export default connect(mapStateToProps)(ChatPage);
