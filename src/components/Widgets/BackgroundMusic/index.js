import React from 'react';
import ReactHowler from 'react-howler';
import music from "assets/backgroundMusic.mp3";

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
                src={music}
                playing={true}
                loop={true}
            />
        )
    }
}

export default BackgroundMusic;
