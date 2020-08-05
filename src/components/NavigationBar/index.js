import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography } from 'components';
import { getAppCustomization } from "../../lib/helpers";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import _ from 'lodash';
import "./index.css";

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

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        const { topTab } = getAppCustomization();

        this.setState({ tabs: topTab.ids });
    }

    renderMenuItem = ({link_url, icon, name}, isMainMenu=false) => {
        return (
            <Link to={link_url} styleName={isMainMenu == true ? 'navigation-step navigation-margin' : 'navigation-step'}>
                <div styleName='img'>
                    <img src={icon} width="22"/>
                </div>
                <div styleName='text'>
                    <Typography variant={'small-body'} color={'white'}>
                        {name}
                    </Typography>
                </div>
            </Link>
        )
    }

    onOpenMenu() {
        const { open } = this.state;

        this.setState({ open: !open })
    }

    render() {
        const { tabs, open } = this.state;
        const styles = classNames("dropdown-content", {
            "dropdown-content-open": open == true
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
                            }, true)
                        )
                    })
                }
                {
                    tabs.length > 2
                    ?
                        <div styleName="dropdown">
                            <a onClick={() => this.onOpenMenu()}>
                                <div styleName="dropdown-dots"/>
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
                    :
                        null
                }
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(NavigationBar);
