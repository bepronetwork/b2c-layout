import React, { Component } from "react";
import "./index.css";
import { Typography } from 'components';
import { CopyText } from '../../copy';

class UnavailablePage extends Component {

    constructor(props){
        super(props);
    }

    isAvailable = () => {
        return false
    }

    getGeoInfo = async () => {
        return new Promise( (resolve, reject) => {
            fetch('https://ipapi.co/json/', { mode : 'no-cors'})
            .then(function(response) {
              return response.json();
            })
            .then(function(myJson) {
                resolve(myJson)
            })
            .catch(reject)
        });
       
    };

    render() {
        const { app } = this.props;
        if (!app) { return null; }
        if(this.isAvailable()){return null}

        const {ln} = this.props;
        const copy = CopyText.homepage[ln];

        return (
            <div styleName="root">
                <div styleName="container">
                    <Typography variant={'h2'} color={'white'}> {copy.CONTAINERS.UNAVAILABLE.TYPOGRAPHY[0]} </Typography>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(UnavailablePage);