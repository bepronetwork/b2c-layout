
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class InformationContainer extends React.Component{

    constructor(props){
        super(props)
    }


    render = () => {

        const { title, icon} = this.props;
        return (
            <Tooltip title={title}>
                <IconButton aria-label={title}>
                    {icon}
                </IconButton>
            </Tooltip>
        )
    }
}



export default InformationContainer;