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
                <Row>
                    <Col xs={3} md={3}>
                        <div styleName='container-image'>
                            <img src={image} styleName='data-image'/>
                        </div>
                    </Col>
                    <Col xs={9} md={9}>
                        <div styleName={'container-text'}>
                            <Typography variant={'small-body'} color={`white`}>
                               {title}
                            </Typography>
                            <div styleName='text-message'>
                                <Typography variant={'h4'} color={'casper'}>
                                    {message}
                                </Typography>
                            </div>
                        </div>
                    </Col>
                </Row>
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
