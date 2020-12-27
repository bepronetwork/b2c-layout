import React, { Component } from "react";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import { Typography } from 'components';
import _ from 'lodash';
import "./index.css";
import dots from "assets/dots.png";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
           tabs: [],
           open: false
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { ln } = props;
        let { topTab } = getAppCustomization();

        topTab = topTab.languages.find(t => t.language.isActivated === true && t.language.prefix === ln.toUpperCase());

        this.setState({ 
            tabs: _.isEmpty(topTab) ? [] : topTab.ids
        });
    }

    renderMenuItem = ({link_url, icon, name}) => {
        if (link_url.startsWith("http")) {
            return (
                <a href={link_url} key={name} styleName={'navigation-step'} target={"_blank"}>
                    {
                        icon
                        ?
                            <div styleName='img'>
                                <img src={icon} width="22" height="22" alt={`${name} menu`} />
                            </div>
                        
                        :
                            <div styleName='img'/>
                    }
                    <div styleName={icon ? 'text' : 'text-empty' }>
                        <Typography variant={'small-body'} color={'white'}>
                            {name}
                        </Typography>
                    </div>
                </a>
            )
        }
        else {
            return (
                <Link to={link_url} key={name} styleName={'navigation-step'}>
                    {
                        icon
                        ?
                            <div styleName='img'>
                                <img src={icon} width="22" height="22" alt={`${name} menu`} />
                            </div>
                        
                        :
                            <div styleName='img'/>
                    }
                    <div styleName={icon ? 'text' : 'text-empty' }>
                        <Typography variant={'small-body'} color={'white'}>
                            {name}
                        </Typography>
                    </div>
                </Link>
            )
        }
    }

    onOpenMenu() {
        const { open } = this.state;

        this.setState({ open: !open })
    }

    render() {
        const { tabs, open } = this.state;
        const styles = classNames("dropdown-content", {
            "dropdown-content-open": open === true
        });


        return (
            <div styleName="tabs">
                {
                    tabs.slice(0, 2).map(t => {
                        return (
                            this.renderMenuItem({
                                link_url: t.link_url,
                                icon: t.icon,
                                name: t.name
                            })
                        )
                    })
                }
                {
                    tabs.length > 2
                    ?
                        <div styleName="main-others">
                            <div styleName="others">
                            {
                                tabs.slice(2, tabs.length).map(t => {
                                    return (
                                        this.renderMenuItem({
                                            link_url: t.link_url,
                                            icon: t.icon,
                                            name: t.name
                                        })
                                    )
                                })
                            }
                            </div>
                            <div styleName="dropdown">
                                <a onClick={() => this.onOpenMenu()}>
                                    <div styleName="dropdown-dots" style={{ backgroundImage: 'url(' + dots + ')'}}/>
                                </a>
                                <div styleName={styles}>
                                    <div styleName="dropdown-nav">
                                        <div styleName="dropdown-column">
                                            {
                                                tabs.slice(2, tabs.length).map(t => {
                                                    return (
                                                        this.renderMenuItem({
                                                            link_url: t.link_url,
                                                            icon: t.icon,
                                                            name: t.name
                                                        })
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    :
                        null
                }
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        ln: state.language
    };
}

export default connect(mapStateToProps)(NavigationBar);
