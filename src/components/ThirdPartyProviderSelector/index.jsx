import React, { Component } from "react";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { Typography, ArrowDownIcon, ArrowUpIcon } from "components";
import { map } from "lodash";
import { getAppCustomization, getIcon } from "../../lib/helpers";
import _ from 'lodash';

import "./index.css";

const defaultProps = {
    providers : [],
    providerId : {},
    open: false
}

class ThirdPartyProviderSelector extends Component {
    
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

    projectData = async (props) => {
        const { providerId, providers } = props;

        this.setState({ providers, providerId });
    }

    getOptions = () => {
        let { providers } = this.state;
            
        if(!providers || _.isEmpty(providers) || providers.length < 0){return};

        let nProviders = [];
        nProviders.push({ value: "all", label: "All" });

        providers.map( 
            p => {
                nProviders.push({
                    value: p.providerEco,
                    label: p.name,
                    icon: p.logo
                })
            }
        );

        return nProviders;
    };

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

    renderLabel() {
        const { open, providerId, providers } = this.state;

        if (_.isEmpty(providerId)) return null;

        let provider = providers.find(p => p.providerEco === providerId);

        if (_.isEmpty(provider)) {
            provider = { name: "All", icon: null };
        }

        const skin = getAppCustomization().skin.skin_type;
        const arrowUpIcon = getIcon(24);
        const arrowDownIcon = getIcon(25);

        return (
            <div styleName="label">
                <div styleName="icon">
                    <img src={provider.logo} width={20} alt="Provider" />
                </div>
                <span>
                    <Typography color="white" variant={'small-body'}>{provider.name}</Typography>
                </span>                    
                {open 
                ? 
                    arrowUpIcon === null ? skin == "digital" ? <ArrowUpIcon /> : <ArrowUp /> : <img src={arrowUpIcon} alt="Arrow Up Icon" /> 
                : 
                    arrowDownIcon === null ?skin == "digital" ? <ArrowDownIcon /> : <ArrowDown /> : <img src={arrowDownIcon} alt="Arrow Down Icon" /> 
                }
            </div>
        );
    }

    renderOptionsLines = () => {
        return map(this.getOptions(), ({ value, label, icon }) => (
        <button
            styleName="option"
            key={value}
            id={value}
            onClick={()=>this.changeProvider(value)}
            type="button"
        >
            <div styleName="icon">
                <img src={icon} width={20}/>
            </div>
            <Typography variant="small-body" color="white">{label}</Typography>
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

    changeProvider = async (providerId) => {
        const { onChangeProvider } = this.props;

        onChangeProvider(providerId);

        this.setState({...this.state, providerId, open : false})
    }

    render() {
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

export default ThirdPartyProviderSelector;