import React, { Component } from "react";
import UserContext from "containers/App/UserContext";
import { Typography } from "components";
import "./index.css";
import _ from "lodash";
export default class ResetPassword extends Component {
    static contextType = UserContext;

    render() {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        console.log("tester")
        return (
            <div styleName="root">
                <div styleName="container">
                    <div styleName='container-small'>                       
                        <div className='row' style={{margin : 0}}>
                            {appInfo.games.map( (item) => this.renderGame(item))}
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}
