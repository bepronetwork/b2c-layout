import React from 'react';
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { Typography, ArrowDownIcon, ArrowUpIcon } from "components";
import { getAppCustomization, getIcon } from "../../lib/helpers";
import _ from 'lodash';
import classNames from 'classnames'
import "./index.css";
import PropTypes from 'prop-types';

class SelectBox extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            open: false,
            value : props.value 
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

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

    componentWillReceiveProps(props){
        this.projectData(props)
    }

    handleClickOutside = event => {
        const isOutsideClick = !this.optionsRef.contains(event.target);
        const isLabelClick = this.labelRef.contains(event.target);

        if (!isLabelClick) {
            setTimeout( () => {
                this.setState({ open: false });
            }, 1*200)
        }
    };

    projectData = (props) => {
        if(props.value){
            this.setState({...this.state, value : props.value})
        }
    }
 
    handleLabelClick = () => {
        const { open } = this.state;

        this.setState({ open: !open });
    };

    onChange = (option) => {
        this.setState({...this.state, value : option, open: false});
        this.props.onChange({ option });
    }

    renderLabel() {
        const { value, open } = this.state;
        const skin = getAppCustomization().skin.skin_type;

        const arrowUpIcon = getIcon(24);
        const arrowDownIcon = getIcon(25);

        return (
            <div styleName="label">
                {value.text}
                {open
                ? 
                    arrowUpIcon === null ? skin == "digital" ? <ArrowUpIcon /> : <ArrowUp /> : <img src={arrowUpIcon} /> 
                :
                    arrowDownIcon === null ? skin == "digital" ? <ArrowDownIcon /> : <ArrowDown /> : <img src={arrowDownIcon} /> 
                }
            </div>
        );
    }

    renderOptionsLines = () => {
        const { options } = this.props;
        return options.map(option => (
            <button
                styleName="option"
                key={option.channel_id}
                id={option.channel_id}
                onClick={() => this.onChange(option)}
                type="button"
            >   
                <Typography variant="small-body" color="grey">{option.text}</Typography>
            </button>
        ));
    };

    renderOptions() {
        const { open } = this.state;

        if (!open) return null;

        return (
            <div styleName="options">
                <span styleName="triangle" />
                {this.renderOptionsLines()}
            </div>
        );
    }

    render = () => {
        const { fullWidth, size, gutterBottom } = this.props;
        const { value } = this.state;

        return (
            <div styleName={classNames('root', { fullWidth }, { 'checked': value.value }, { 'small': size === 'small' }, { gutterBottom })} onClick={this.handleLabelClick}>
                <button
                    ref={el => {
                        this.labelRef = el;
                    }}
                    type="button">
                    {this.renderLabel()}
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

SelectBox.propTypes = {
    size: PropTypes.oneOf(['small'])
}


export default SelectBox;