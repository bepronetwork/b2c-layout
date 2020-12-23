import React from "react";
import { Typography, InputText, UsersIcon } from "components";
import ArrowDown from "components/Icons/ArrowDown";
import { connect } from "react-redux";
import _, { uniqueId } from 'lodash';
import "./index.css";
import languages from "../../config/languages";
import { setMessageNotification } from "../../redux/actions/message";
import { CopyText } from "../../copy";
import store from "../App/store";
import { dateToHourAndMinute, getSkeletonColors, getAppCustomization, getIcon } from "../../lib/helpers";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import delay from 'delay';

const sound = localStorage.getItem("sound");
const chatUsersConst = Math.floor(Math.random() * (400 - 200) + 200);
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
    isLoading: true,
    isGoDownVisible: false
}

class ChatPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = defaultProps;
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    scrollToBottom = async () =>  {
        const { isLoading } = this.state;
        const { index, selected } = this.props;
        if (index === selected) {
            await delay(500);
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            if(isLoading) {
                await delay(3000);
                this.setState({ isLoading : false, isGoDownVisible : false });
            }
        }
    }

    projectData = async (props) => {
        if(props.chat.messages.length > 0){
            this.setState({
                participants : props.chat.participants,
                messages :  props.chat.messages,
                name : props.chat.name,
                open :  props.chat.open
            });

            this.scrollToBottom();
        }
    }

    handleScroll = async () => {
        const { isGoDownVisible } = this.state;

        if(isGoDownVisible === false && !this.isInViewport(this.messagesEnd)) {
            this.setState({ isGoDownVisible : true });
        }
        else if(isGoDownVisible === true && this.isInViewport(this.messagesEnd)) {
            this.setState({ isGoDownVisible : false });
        }
    }

    isInViewport(element, offset = 0) {
        if (!element) return false;
        const top = element.getBoundingClientRect().top;
        return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
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
        this.setState({message : ''})
    }

    createMessageBox = ({username, message, id, time}) => {
        const { isLoading } = this.state;

        return(
            <div key={id}>
                {isLoading ?
                    <SkeletonTheme color={getSkeletonColors().color} highlightColor={getSkeletonColors().highlightColor}>
                        <div styleName='message-box' key={id} style={{opacity : '0.5'}}> 
                            <div styleName='info'>
                                <Skeleton width={100}/>
                            </div>
                            <div styleName={'info-message-container'}>
                                <Skeleton />
                            </div>
                        </div>
                    </SkeletonTheme>
                :
                    <div styleName='message-box' key={id}> 
                        <div styleName='info'>
                            <div styleName='avatar'>
                                <Typography variant="x-small-body" color="grey"> 
                                    {username.substring(0,1).toUpperCase()} 
                                </Typography>
                            </div> 
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
                }
            </div>
            
        )
    }

    createSkeletonMessages = () => {
        let messages = [];
        const { color, highlightColor } = getSkeletonColors();
    
        for (let i = 0; i < 150; i++) {
            messages.push(<SkeletonTheme key={uniqueId("skeleton-messages-")} color={color} highlightColor={highlightColor}><div styleName='message-box' key={i} style={{opacity : '0.5'}}><div styleName='info'><Skeleton width={100}/></div><div styleName={'info-message-container'}><Skeleton /></div></div></SkeletonTheme>);
        }

        return messages;
    }

    changeLanguage = async (item) => {
        item = languages.find( a => {
            if(a.name.toLowerCase() == item.name.toLowerCase()){
                return a;
            }
        })
        let { profile } = this.props;
        profile.getChat().changeLanguage({language : item.name, channel_id : item.name.toLowerCase()});
        this.setState({language : item.name.toLowerCase()})
    }

    changeMessage = event => {
        this.setState({ message: event.target.value });
    };

    render() {
        const { ln } = this.props;
        const { isLoading, isGoDownVisible } = this.state;
        const copy = CopyText.shared[ln];
        const copy2 = CopyText.homepage[ln];

        const usersIcon = getIcon(1);

        return (
            <div styleName="root">
                    <div styleName="container">
                        <div styleName="message-top" style={{backgroundColor : getAppCustomization().theme === "light" ? "white" : null}}>
                            <div styleName="online">
                                {this.state.open ? 
                                    <div styleName={'green-light'}/>
                                :
                                    <div styleName={'red-light'}/>
                                }
                            </div>
                            <div styleName="right">
                                <div styleName={'users-box'}>
                                    <Typography variant="small-body" color="casper">
                                        {this.state.participants + chatUsersConst} 
                                    </Typography>
                                    <div styleName="users-icon">
                                        { usersIcon === null ? <UsersIcon /> : <img src={usersIcon} /> }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={el => { this.el = el; }} styleName="text-container" onScroll={this.handleScroll}>
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
                        {isGoDownVisible === true
                            ?
                                <div styleName="go-down"> 
                                    <a href="#" onClick={() => this.scrollToBottom()}>
                                        <div styleName="arrow"> 
                                            <ArrowDown />
                                        </div>
                                    </a>
                                </div>
                            :
                                null
                        }
                        <div styleName="message-container">
                            <form onSubmit={this.sendMessage}>
                                <InputText
                                    name="text"
                                    placeholder={copy.PLACEHOLDER_CHAT}
                                    onChange={this.changeMessage}
                                    value={this.state.message}
                                    type={'slim'}
                                />
                               
                                <button
                                    disabled={this.state.message.length < 1}
                                    type="submit"
                                    styleName="button"
                                >
                                    <Typography variant="small-body" color="fixedwhite">
                                        {copy2.CONTAINERS.CHAT.TYPOGRAPHY[0]}
                                    </Typography>
                                </button>

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
