import React, { Component } from "react";
import { Typography, Info } from 'components';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";

class ThirdPartyGameCard extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    componentWillReceiveProps(props){
    }

    projectData = async (props) => {
    }

    linkToGamePage({id, partnerId, url}) {
        const { profile, onHandleLoginOrRegister } = this.props;

        if (!profile || _.isEmpty(profile)) {
            return onHandleLoginOrRegister("login");
        }

        this.props.history.push(`/casino/game/${id}?partner_id=${partnerId}&url=${url}`);
    }

    render() {
        const { game } = this.props;

        return (
            <div class={"col"} styleName="col">
                <div styleName="root">
                    <div styleName="image-container dice-background-color" onClick={() => this.linkToGamePage({id: game.id, partnerId: game.partnerId, url: game.url})} style={{background: "url("+game.icon+") center center / cover no-repeat"}}>
                    </div>
                    <div styleName="title">
                        <div styleName="name" onClick={() => this.linkToGamePage({id: game.id, partnerId: game.partnerId, url: game.url})}>
                            <Typography variant="x-small-body" weight="semi-bold" color="white">
                                {game.title}
                            </Typography>
                        </div>
                        <span styleName="info">
                            <Info text="Edge: %"/>
                        </span>
                    </div>
                    <div styleName="title">
                        <div styleName="prov">
                            <Typography variant={'x-small-body'} color={'grey'}>{game.provider}</Typography>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(ThirdPartyGameCard);