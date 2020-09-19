import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";
import './index.css';

class DataContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false,
            closed : false
        }
    }

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


function mapStateToProps(state){
    return {
        profile : state.profile
    };
}

export default connect(mapStateToProps)(DataContainer);
