import React, { Component } from "react";
import {  DropDownField } from "components";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import { MenuItem } from '@material-ui/core';
import languages from "../../config/languages";
import PropTypes from "prop-types";

import "./index.css"
import { setLanguageInfo } from "../../redux/actions/language";
import { CopyText } from '../../copy';
const defaultProps = {
    language : languages[0]
}

class LanguagePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  ...defaultProps };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
       
    }

    changeLanguage = async (item) => {
        item = languages.find( a => {
            if(a.channel_id == item.value){
                return a;
            }
        })
        await this.props.dispatch(setLanguageInfo(item));
        this.setState({...this.state, language : item.channel_id})
    }

    render() {
        const ln = defaultProps.language.nick;
        console.log(ln);
        const copy = CopyText.languagePickerIndex[ln];
        return (
            <div styleName="root">
                <div styleName="container">          
                    <DropDownField
                        id="language"
                        type={'language'}
                        onChange={this.changeLanguage}
                        options={languages}
                        value={this.state.language.channel_id}
                        style={{width : '80%'}}
                        label={copy.INDEX.DROP_DOWN_FIELD.LABEL[0]}
                        >
                        {languages.map(option => (
                            <MenuItem key={option.channel_id} value={option.channel_id}>
                                <img src={option.image} styleName='image-language'/> 
                            </MenuItem>
                        ))}
                    </DropDownField> 
                </div>
            </div>
        );
    }
}




function mapStateToProps(state){
    return {
        profile: state.profile,
        chat : state.chat,
        ln: state.language
    };
}

LanguagePicker.propTypes = {
    dispatch: PropTypes.func
};

export default connect(mapStateToProps)(LanguagePicker);
