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
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

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
    language : languages[0],
    isLoading: true
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
        const { index, selected } = this.props
        if (index === selected) {
            setTimeout(() => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                    this.setState({ isLoading : false })
                }, 3000)
            }, 500)
        }
    }

    projectData = async (props) => {
        if(props.chat.messages.length > 0){
            this.setState({...this.state,
                participants : props.chat.participants,
                messages :  props.chat.messages,
                name : props.chat.name,
                open :  props.chat.open,
                isLoading: true
            });

            this.scrollToBottom();
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
        }
        this.setState({...this.state, message : ''})
    }

    createMessageBox = ({username, message, id, time}) => {
        return(
            <div>
                <div styleName='message-box' key={id}> 
                    <div styleName='info'>
                        <div style={{float : 'left', marginRight : 8}}>
                            <Typography variant="x-small-body" color="casper"> 
                                @{username} 
                            </Typography>
                        </div> 
                        <div style={{float : 'left', marginRight : 8}}>
                            <Typography variant="x-small-body" color="grey"> 
                                {dateToHourAndMinute(time)} 
                            </Typography>
                        </div>
                    </div>
                    <div styleName={'info-message-container'}>
                        <Typography variant="small-body" color="white">
                            {message}
                        </Typography>
                    </div>
                </div>
            </div>
            
        )
    }

    createSkeletonMessages = () => {
        let messages = []
    
        for (let i = 0; i < 150; i++) {
            messages.push(<SkeletonTheme color="#05040c" highlightColor="#17162d"><div styleName='message-box' key={i} style={{opacity : '0.3'}}><div styleName='info'><Skeleton width={100}/></div><div styleName={'info-message-container'}><Skeleton /></div></div></SkeletonTheme>);
        }

        return messages;
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
        const { isLoading } = this.state;
        const copy = CopyText.shared[ln];
        const copy2 = CopyText.homepage[ln];
        return (
            <div styleName="root">
                    <div styleName="container">
                        <div ref={el => { this.el = el; }} styleName="text-container">
                            {isLoading ?
                                this.createSkeletonMessages()
                            :
                                this.state.messages.map((item) => {
                                    return this.createMessageBox({username : item.user.id, message : item.text, id : item.id, time : new Date(item.created_at)})
                                })
                            }
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
                                    
                                        <Col>
                                            {this.state.open ? 
                                                <div styleName={'green-light'}/>
                                            :
                                                <div styleName={'red-light'}/>
                                            }

                                        </Col>
                                        <Col>
                                            <div>
                                                <DropDownField
                                                    id="language"
                                                    type={'language'}
                                                    onChange={this.changeLanguage}
                                                    options={languages}
                                                    value={this.state.language.channel_id}
                                                    style={{width : '80%'}}
                                                    height={30}
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
                                        <Col>
                                            <div styleName={'users-box'}>
                                                <Typography variant="small-body" color="casper">
                                                    {this.state.participants} <UsersGroupIcon size={25}/>
                                                </Typography>
                                            </div>
                                        </Col>
                                        <Col>
                                            <button
                                                disabled={this.state.message.length < 1}
                                                type="submit"
                                                styleName="button"
                                            >
                                                <Typography variant="small-body" color="white">
                                                    {copy2.CONTAINERS.CHAT.TYPOGRAPHY[0]}
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
