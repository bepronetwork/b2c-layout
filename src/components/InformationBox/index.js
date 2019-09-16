import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";
import './index.css';

class InformationBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false
        }
    }

    render(){
        const { 
            message, image
        } = this.props;

        return (
            <div styleName={`container-root alert`}>
                <Row>
                    <Col xs={3} md={3}>
                        <div styleName='container-image'>
                            <img src={image} styleName='payment-image'/>
                        </div>
                    </Col>
                    <Col xs={9} md={9}>
                        <div styleName={'container-text'}>
                            <Typography variant={'body'} color={'red'}>
                                Don´t Procceed!
                            </Typography>
                            <Typography variant={'x-small-body'} color={'white'}>
                                {message}
                            </Typography>
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

export default connect(mapStateToProps)(InformationBox);
