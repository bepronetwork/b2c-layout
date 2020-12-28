import React, { Component } from "react";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import { POSITION } from './properties';
import { LayoutLeft, LayoutRight, LayoutTop, LayoutBottom } from './Positions';
import _ from 'lodash';
import "./index.css";

class SubSections extends Component {

    state = {
        subSections: [],
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        let { subSections } = getAppCustomization();
        const { location, ln } = props;

        subSections = subSections.languages.find(s => s.language.isActivated === true && s.language.prefix === ln.toUpperCase());

        if(!_.isEmpty(subSections)){
            subSections = subSections.ids.filter(s => s.location === location);
        }

        this.setState({
            subSections
        });
    }

    renderSubSection = (subSection) => {
        const commonProps = {
            data: subSection,
            key: subSection.title
        }

        switch(subSection.position) {
            case POSITION.LEFT:
              return <LayoutLeft {...commonProps} />;
            case POSITION.RIGHT:
                return <LayoutRight {...commonProps} />;
            case POSITION.TOP:
                return <LayoutTop {...commonProps} />;
            case POSITION.BOTTOM:
                return <LayoutBottom {...commonProps} />;
            default:
                break;
        }

        return null;
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

                    return null;
                })}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default connect(mapStateToProps)(SubSections);
