import React, { Component } from "react";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import { Typography } from 'components';
import { Col, Row } from 'reactstrap';
import casino from 'assets/casino.png';
import { Link } from "react-router-dom";
import { CopyText } from '../../copy';

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
        const {ln} = this.props;
        const copy = CopyText.navigationBarIndex[ln];
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
                                    {copy.INDEX.TYPOGRAPHY.TEXT[0]}
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
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(NavigationBar);
