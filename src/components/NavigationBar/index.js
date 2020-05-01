import React, { Component } from "react";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import { Typography, CasinoIcon } from 'components';
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
                <Link to='/' styleName='navigation-step'>
                    <div styleName='img'>
                        <CasinoIcon/>
                    </div>
                    <div styleName='text'>
                        <Typography variant={'small-body'} color={'white'}>
                            {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                        </Typography>
                    </div>
                </Link>
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
