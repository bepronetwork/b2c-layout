import React, { Component } from "react";
import queryString from 'query-string'
import { find } from "lodash";
import { GameCard, Banners, JackpotPot } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";
import { Col} from 'reactstrap';
import games from '../../config/games';
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
        const { onHandleResetPassword, onHandleConfirmEmail,  match: { params } } = this.props;

        let queryParams = queryString.parse(this.props.location.search);

        if (onHandleResetPassword) return onHandleResetPassword({ params : queryParams, mode : "new"});

        if (onHandleConfirmEmail) {
            queryParams = { ...queryParams, app : params.app };
            return onHandleConfirmEmail({ params : queryParams });
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
        const { onTableDetails } = this.props;
        if(!this.isGameAvailable(metaName)){return null}
        return (
                <div class={"col"} styleName="col">
                    <GameCard
                        path={metaName}
                        title={name}
                        edge={edge}
                        image_url={image_url}
                        tableLimit={tableLimit}
                        background_url={background_url}
                        onTableDetails={onTableDetails}
                    >
                    </GameCard>
                </div>
        )
    }

    render() {
        const { onTableDetails } = this.props;
        const mobileBreakpoint = 768;
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
                    <JackpotPot/>
                    {
                        document.documentElement.clientWidth <= mobileBreakpoint
                        ?
                            null
                        :
                            <div styleName="last-bets">
                                <LastBets onTableDetails={onTableDetails} />
                            </div>
                    }
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