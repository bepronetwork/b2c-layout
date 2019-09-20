import React from 'react';
import ReactHowler from 'react-howler';

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
                src='https://storage.googleapis.com/background-music-betprotocol/background-music.mp3'
                playing={true}
                loop={true}
            />
        )
    }
}

export default BackgroundMusic;
