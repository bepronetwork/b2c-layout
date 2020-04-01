import React from 'react';
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import Typography from "components/Typography";
import _ from 'lodash';

import "./index.css";

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

        if (isOutsideClick && !isLabelClick) {
            this.setState({ open: false });
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
        this.setState({...this.state, value : option});
        this.props.onChange({ option });
    }

    renderLabel() {
        const { value, open } = this.state;

        return (
            <div styleName="label">
                <span>
                    <Typography color="white" variant={'small-body'}>{value.text}</Typography>
                </span>
                {open ? <ArrowUp /> : <ArrowDown />}
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
                <Typography variant="small-body" color="casper">{option.text}</Typography>
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

        const {  } = this.props;

        return (
            <div styleName="root">
                <button
                    ref={el => {
                        this.labelRef = el;
                    }}
                    onClick={this.handleLabelClick}
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


export default SelectBox;