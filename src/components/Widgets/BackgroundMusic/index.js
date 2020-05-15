import React from 'react';
import ReactHowler from 'react-howler';
import backgroundMusic from "assets/background-music.mp3";

class BackgroundMusic extends React.Component{
    constructor(props){
        super(props);
    }

    // This sound file may not work due to cross-origin setting
    render () {
        const { mute } = this.props;
        return (
            <ReactHowler
                mute={mute}
                src={backgroundMusic}
                playing={true}
                loop={true}
            />
        )
    }
}

export default BackgroundMusic;
