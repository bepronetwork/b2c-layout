import React from 'react';
import ReactHowler from 'react-howler';
import music from "assets/backgroundMusic.mp3";

class BackgroundMusic extends React.Component{
    render () {
        const { mute } = this.props;
        return (
            <ReactHowler
                mute={mute}
                src={music}
                playing={true}
                loop={true}
            />
        )
    }
}

export default BackgroundMusic;
