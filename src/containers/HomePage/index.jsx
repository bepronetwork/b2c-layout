import React, { Component } from "react";
import { find } from "lodash";
import { GameCard, CoinFlip, Roulette, Caroussel, Partners, Media } from "components";
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
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    renderPlayNow = () => {
        const { user } = this.context;
        const { onHandleLoginOrRegister } = this.props;

        return <PlayInvitation {...this.props} onLoginRegister={onHandleLoginOrRegister} />;
    };

    isGameAvailable = metaName => {
        return find(games, { metaName : metaName });
    };

    renderGame = ({metaName, name, edge, image_url, tableLimit}) => {
        if(!this.isGameAvailable(metaName)){return null}
        return (
                <Col md={6} lg={4}>
                    <GameCard
                        path={metaName}
                        title={name}
                        edge={edge}
                        image_url={image_url}
                        tableLimit={tableLimit}
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
                    <Partners/>
                    <Media/>
                    <Footer/>
                </div>
            </div>
        );
    }
}
