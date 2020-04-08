import React, { Component } from "react";
import queryString from 'query-string'
import { find } from "lodash";
import { GameCard, Banners } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";
import { Col} from 'reactstrap';
import { setMessageNotification } from '../../redux/actions/message';
import games from '../../config/games';
import store from '../../containers/App/store';
import LastBets from "../LastBets/HomePage";
import Footer from "../Footer";
import { connect } from 'react-redux';
import { CopyText } from "../../copy";
import _ from 'lodash';
import "./index.css";
class HomePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired,
        onHandleResetPassword: PropTypes.func,
        onHandleConfirmEmail: PropTypes.func
    };

    componentDidMount = () => {
        const { ln, profile, onHandleResetPassword, onHandleConfirmEmail,  match: { params } } = this.props;
        const copy = CopyText.homepage[ln];
        let queryParams = queryString.parse(this.props.location.search);

        if (onHandleResetPassword) return onHandleResetPassword({ params : queryParams, mode : "new"});

        if (onHandleConfirmEmail) {
            queryParams = { ...queryParams, app : params.app };
            return onHandleConfirmEmail({ params : queryParams });
        }

        if(!_.isEmpty(profile) && !profile.user.email_confirmed){
            store.dispatch(setMessageNotification(copy.CONTAINERS.APP.NOTIFICATION[0]));
        }
    };

    renderPlayNow = () => {
        const { user } = this.context;
        const { onHandleLoginOrRegister } = this.props;

        return <PlayInvitation {...this.props} onLoginRegister={onHandleLoginOrRegister} />;
    };

    isGameAvailable = metaName => {
        return find(games, { metaName : metaName });
    };

    renderGame = ({metaName, name, edge, image_url, tableLimit, background_url}) => {
        if(!this.isGameAvailable(metaName)){return null}
        return (
                <Col>
                    <GameCard
                        path={metaName}
                        title={name}
                        edge={edge}
                        image_url={image_url}
                        tableLimit={tableLimit}
                        background_url={background_url}
                    >
                    </GameCard>
                </Col>
        )
    }

    render() {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));
        if (!appInfo) { return null; }

        return (
            <div styleName="root">
               <Banners/> 
                {/* this.renderPlayNow() */}
                <div styleName="container">
                    <div styleName='container-small'>                       
                        {appInfo.games.map( (item) => this.renderGame(item))}
                    </div> 
                    <div styleName="last-bets">
                        <LastBets/>
                    </div>
                    {/* <Media/> */}
                    <Footer/>
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

export default connect(mapStateToProps)(HomePage);