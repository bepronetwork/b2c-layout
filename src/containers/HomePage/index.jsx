import React, { Component } from "react";
import queryString from 'query-string'
import { find } from "lodash";
import { GameCard, CoinFlip, Roulette, Caroussel, Media } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";
import { Row, Col} from 'reactstrap';
import games from '../../config/games';
import "./index.css";
import LastBets from "../LastBets/HomePage";
import Footer from "../Footer";
export default class HomePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired,
        onHandleResetPassword: PropTypes.func
    };

    componentDidMount = () => {
        const { onHandleResetPassword } = this.props;
        const params = queryString.parse(this.props.location.search);

        if (onHandleResetPassword) return onHandleResetPassword({ params, mode : "new"});
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
                <Col md={6} lg={4}>
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
               <Caroussel/> 
                {/* this.renderPlayNow() */}
                <div styleName="container">
                    <div styleName='container-small'>                       
                        <div className='row' style={{margin : 0}}>
                            {appInfo.games.map( (item) => this.renderGame(item))}
                        </div>
                    </div> 
                    <LastBets/>
                    {/* <Media/> */}
                    <Footer/>
                </div>
            </div>
        );
    }
}
