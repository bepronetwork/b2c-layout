import React, { Component } from "react";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import { Typography } from 'components';
import { Col, Row } from 'reactstrap';
import casino from 'assets/casino.png';
import { Link } from "react-router-dom";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {}

    render() {
        return (
            <Row styleName="root">
                <Link to='/' styleName='navigation-step'>
                    <Row>
                        <Col xs={2}>
                            <img src={casino}/>
                        </Col>
                        <Col xs={10}>
                            <div styleName='text'>
                                <Typography variant={'small-body'} color={'white'}>
                                    Casino
                                </Typography>
                            </div>
                        </Col>
                    </Row>
                </Link>
            </Row>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(NavigationBar);
