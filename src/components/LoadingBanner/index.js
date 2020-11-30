import React from "react";
import { connect } from "react-redux";
import './index.css';
import { ProgressBarLinear } from "../ProgressBar";
import { getAppCustomization } from "../../lib/helpers";

class LoadingBanner extends React.Component{
    constructor(props){
        super(props);
        this.state = { 

        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }   

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
       
    }

    render(){
        const { 
            isLoaded
        } = this.props;
        const { logo } = getAppCustomization();

        if(isLoaded){return null}
        return (

            <div styleName='back-loading-banner'>
                <div styleName="loading">
                    <img src={logo.id} styleName={'image-loading'} alt="Placeholder" />
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

export default connect(mapStateToProps)(LoadingBanner);
