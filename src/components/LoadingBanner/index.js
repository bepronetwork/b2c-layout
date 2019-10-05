import React from "react";
import { connect } from "react-redux";
import './index.css';
import { ProgressBarLinear } from "../ProgressBar";

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
            isLoaded, progress
        } = this.props;
        if(isLoaded){return null}
        return (

            <div styleName='back-loading-banner'>
                <div id="loading">
                    <ProgressBarLinear progress={progress}/>
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
