import React from "react";
import { Typography } from 'components';
import './index.css';

class DataContainer extends React.Component{
    render(){
        const { 
            message, image, title
        } = this.props;

        return (
            <div styleName={`container-root`}>
                <div styleName='container-image'>
                    {image}
                </div>
                <div styleName={'container-text'}>
                    <Typography variant={'small-body'} color={`white`}>
                        {title}
                    </Typography>
                </div>
                <div styleName='text-message'>
                    <Typography variant={'small-body'} color={'white'}>
                        {message}
                    </Typography>
                </div>
            </div>
        )
    }
}

export default DataContainer;
