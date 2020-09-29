import React, { Component } from "react";
import { Typography, ArrowDownIcon, ArrowUpIcon } from "components";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { CopyText } from '../../copy';
import { connect } from "react-redux";
import languages from "../../config/languages";
import { setLanguageInfo } from "../../redux/actions/language";
import { isUserSet, getAppCustomization, getIcon } from "../../lib/helpers";
import classNames from "classnames";

import "./index.css";

const defaultProps = {
    language : languages[0],
    open: false
}

class LanguageSelector extends Component {
    
    state = {
        ...defaultProps
    };

    componentDidUpdate() {
        const { open } = this.state;

        if (open) {
            document.addEventListener("mousedown", this.handleClickOutside);
        } else {
            document.removeEventListener("mousedown", this.handleClickOutside);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = event => {
        const isOutsideClick = !this.optionsRef.contains(event.target);
        const isLabelClick = this.labelRef.contains(event.target);

        if (isOutsideClick && !isLabelClick) {
            this.setState({ open: false });
        }
    };

    handleLabelClick = () => {
        const { open } = this.state;

        this.setState({ open: !open });
    };

    changeLanguage = async (item) => {
        const { profile } = this.props;
        const { open } = this.state;

        item = languages.find( a => {
            if(a.channel_id == item.channel_id){
                return a;
            }
        })
        
        if(isUserSet(profile)){
            profile.getChat().changeLanguage({language : item.name, channel_id : item.channel_id});
        }
        await this.props.dispatch(setLanguageInfo(item));
        this.setState({...this.state, language : item, open: !open})
    }

    onDoAction = async (onChange, option) => {
        this.setState({ open : false })

        if (onChange) {
            onChange(option);
        }
        else {
            this.changeLanguage(option);
        }
    }

    renderOptionsLines = () => {
        const { onChange, size, color } = this.props;

        return languages.map(option => (
            <button
                styleName="option"
                key={option.channel_id}
                id={option.channel_id}
                onClick={()=>this.onDoAction(onChange, option)}
                type="button"
            >   
                <img src={option.image}/>
                <Typography variant={size ? size : "small-body"} color={color ? color : "white"} >{option.name}</Typography>
            </button>
        ));
    };

    renderOptions() {
        const { open } = this.state;
        const { expand } = this.props;

        if (!open) return null;

        const optionsStyles = classNames("options", {
            expandBottom: expand === "bottom"
        });

        const triangleStyles = classNames("triangle", {
            triangleBottom: expand === "bottom"
        });

        return (
        <div styleName={optionsStyles}>
            <span styleName={triangleStyles} />
            {this.renderOptionsLines()}
        </div>
        );
    }

    render() {
        const ln = defaultProps.language.nick;
        const copy = CopyText.languagePickerIndex[ln];
        const { language, open } = this.state;
        const { showArrow, size, color } = this.props;
        const skin = getAppCustomization().skin.skin_type;

        const styles = classNames("item", {
            itemHor: showArrow === true
        });

        const arrowUpIcon = getIcon(24);
        const arrowDownIcon = getIcon(25);

        return (
            <div styleName="root">
                <button
                    ref={el => {
                        this.labelRef = el;
                    }}
                    onClick={this.handleLabelClick}
                    type="button">
                    <span styleName={styles}>
                        <img src={language.image}/>
                        <Typography variant={size ? size : "small-body"} color={color ? color : "grey"}>
                            {language.name}
                        </Typography>
                        {
                            showArrow === true 
                            ?  
                                open 
                                ? 
                                    arrowUpIcon === null ? skin == "digital" ? <ArrowUpIcon /> : <ArrowUp /> : <img src={arrowUpIcon} /> 
                                : 
                                    arrowDownIcon === null ?skin == "digital" ? <ArrowDownIcon /> : <ArrowDown /> : <img src={arrowDownIcon} /> 
                            : 
                                null  
                        }
                    </span>
                </button>

                <div
                    ref={el => {
                        this.optionsRef = el;
                    }}>
                    {this.renderOptions()}
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


export default connect(mapStateToProps)(LanguageSelector);