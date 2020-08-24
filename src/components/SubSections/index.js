import React, { Component } from "react";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import { POSITION } from './properties';
import { LayoutLeft, LayoutRight, LayoutTop, LayoutBottom } from './Positions';
import _ from 'lodash';
import "./index.css";

class SubSections extends Component {

    constructor(props){
        super(props);
        this.state = {
            subSections: [],
            component: null
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        let { subSections } = getAppCustomization();
        const { location } = this.props;

        if(!_.isEmpty(subSections)){
            subSections = subSections.ids.filter(s => s.location == location);
        }

        this.setState({
            subSections
        });
    }

    renderSubSection = (subSection) => {
        switch(subSection.position) {
            case POSITION.LEFT:
              return <LayoutLeft data={subSection}/>;
            case POSITION.RIGHT:
                return <LayoutRight data={subSection}/>;
            case POSITION.TOP:
                return <LayoutTop data={subSection}/>;
            case POSITION.BOTTOM:
                return <LayoutBottom data={subSection}/>;

        }
    }

    render() {
        const { subSections } = this.state;

        if(_.isEmpty(subSections)) { return null };

        return (
            <div styleName="sub-sections">
                {subSections.map(s => {
                    if(!_.isEmpty(s.title) && !_.isEmpty(s.text)) {
                        return this.renderSubSection(s);
                    }
                })}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(SubSections);
