import React, { Component } from "react";
import "./index.css";
import { Typography } from 'components'; 
import axios from 'axios';

export default class UnavailablePage extends Component {

    constructor(props){
        super(props);
        this.state = {

        };
    }

    componentDidMount(){
        this.projectData();
    }

    isAvailable = () => {
        return false
    }

    projectData = async () => {
        let data = await this.getGeoInfo();
        console.log(data)
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
        const { countryName, countryCode } = this.state;
        if (!app) { return null; }
        if(this.isAvailable()){return null}
        console.log(countryName, countryCode)
        return (
            <div styleName="root">
                <div styleName="container">
                    <Typography variant={'h2'} color={'white'}> Seems like we for now not available at your geography  </Typography>
                </div>
            </div>
        );
    }
}
