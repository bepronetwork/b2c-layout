import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { toLower } from "lodash";
import avatar from 'assets/avatars/avatar.svg';

import "./index.css";

export default class Account extends Component {
 
    render() {
        return (
            <img src={avatar} style={{width : 17, marginLeft : -2}} alt="Avatar Icon" />
        );
    }
}
