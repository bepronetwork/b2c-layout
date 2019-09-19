import React from 'react';
import BackgroundMusic from './BackgroundMusic';
import './index.css';
class Widgets extends React.Component{
    constructor(props){
        super(props);
    }

    
    // This sound file may not work due to cross-origin setting
    render () {
        return (
            <div>
                <BackgroundMusic/>
            </div>
        )
    }
}

export default Widgets;
