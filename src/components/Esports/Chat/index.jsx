import React, { Component } from "react";
import "./index.css";

class Chat extends Component {

    render() {
        const { streaming } = this.props;
        const channel = streaming.substring(streaming.lastIndexOf('=') + 1);

        return (
            <iframe frameborder="0"
                scrolling="no"
                id="Chat Embed"
                title="chat_embed"
                src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}&te-theme=dark&darkpopout`}
                height="500"
                width="100%">
            </iframe>
        );
    }
}

export default Chat;