import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { find } from "lodash";
import HomePage from "containers/HomePage";
import {
    Navbar,
    Modal,
    Tabs,
    LoginForm,
    RegisterForm,
    CashierForm,
    LoadingBanner,
    MessageForm,
    Widgets,
    AffiliateWithdrawForm
} from "components";

import PlinkoPage from "containers/PlinkoPage";
import DicePage from "containers/DicePage";
import FlipPage from "containers/FlipPage";
import RoulettePage from "containers/RoulettePage";
import WheelPage from "../WheelPage";
import WheelVariation1 from "../WheelVariation1Page";

import { login, logout, register } from "lib/api/users";
import getAppInfo from "lib/api/app";
import handleError from "lib/api/handleError";
import User from "controllers/User/User";
import UserContext from "./UserContext";
import { Row, Col } from 'reactstrap';
import "./index.css";
import Web3 from "web3";
import { setProfileInfo } from "../../redux/actions/profile";
import store from "./store";
import Cache from "../../lib/cache/cache";
import ChatPage from "../Chat";
import { CopyText } from "../../copy";
import { setMessageNotification } from "../../redux/actions/message";
import queryString from 'query-string'

import { connect } from 'react-redux';
import _ from 'lodash';
import { setStartLoadingProcessDispatcher } from "../../lib/redux";
import AccountPage from "../AccountPage";
import NavigationBar from "../../components/NavigationBar";
import { getQueryVariable, getAppCustomization } from "../../lib/helpers";
import ChatChannel from "../../controllers/Chat";
import AnnouncementTab from "../../components/AnnouncementTab";
const history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true
        }
    }

    componentDidMount = () => {
        this.asyncCalls();
        this.getQueryParams();

    };

    getQueryParams = () => {
        const ref = getQueryVariable('ref');
        Cache.setToCache('affiliate', ref);
    }

    start = async () => {
        this.setState({...this.state, isLoading : false});
    }


    closeStaticLoading = () => {
        document.getElementById("loading").style.display = "none";
        document.getElementById("back").style.display = "none";
    }

	asyncCalls = async () => {
        try{
            this.startWallet();
            await this.loginAccount();
            this.closeStaticLoading();
        }catch(err){
            let app = await getAppInfo();
            const { publicKey } = app.integrations.chat;
            this.chat = new ChatChannel({publicKey});
            this.chat.__init__();
            setStartLoadingProcessDispatcher(6);
        }
        
        this.start();
    }

    loginAccount = async () => {
        // Get App Ino
        await this.updateAppInfo();
    
        try{
            let cache = Cache.getFromCache('Authentication');
            if(cache && cache.password){
                let res = await this.handleLogin({
                    username : cache.username, 
                    password : cache.password
                });
                if(!res || (res.status != 200)){throw new Error('Login didn´t work')}
            }else{
                throw new Error('Login didn´t work')
            }
        }catch(err){
            // TO DO
            throw err;
		}

    }

    state = {
        registerLoginModalOpen: null,
        cashierOpen: null,
        error: null,
        isLoading : true
    };

    handleRegisterLoginModalClose = () => {
        this.setState({ registerLoginModalOpen: null, error: null });
    };

    handleCashierModalClose = () => {
        this.setState({ cashierOpen: null });
    };

    handleAccountModalClose = () => {
        this.setState({ accountInfoOpen: null });
    };

    handleTabChange = name => {
        this.setState({ registerLoginModalOpen: name, error: null });
    };

    handleLoginOrRegisterOpen = tab => {
        this.setState({ registerLoginModalOpen: tab });
    };

    handleCashierOpen = () => {
        this.setState({ cashierOpen: true });
    };

    handleAccountOpen = ({history}) => {
        history.push('/account');
    }

    handleLogin = async form => {
        try {
            const response = await login(form);       
            Cache.setToCache('Authentication', form);
            if (response.status != 200) {
                this.setState({ error: response.status });
            }else{
                let user = await this.updateUser(response);
                await user.updateUser();
                this.setState({ registerLoginModalOpen: null, error: null });
            }
            return response;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    handleRegister = async form => {
        try {
            const response = await register(form);
            if (response.status !== 200) { return this.setState({ error: response }); }
            this.handleLogin({username : form.username, password : form.password});
        } catch (error) {
            return handleError(error);
        }
    };
    
    startWallet = async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
            // Acccounts always exposed
        }
        // Non-dapp browsers...
        else {
            window.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
            await store.dispatch(setMessageNotification(CopyText.Errors.en.NON_ETHEREUM_BROWSER_ENTRY));
        }        

    }


    updateUser = async user => {
        
        /* Destory Unlogged Chat Instance */
        if(this.chat){
            await this.chat.kill();
            this.chat = null;
        }

        const appInfo = this.state.app;

        let userObject = new User({
            app : appInfo,
            platformAddress: appInfo.platformAddress,
            tokenAddress: appInfo.platformTokenAddress,
            decimals: appInfo.decimals,
            integrations : appInfo.integrations,
            appId: appInfo.id,
            userId: user.id,
            user : user
        })
        await store.dispatch(setProfileInfo(userObject));
        Cache.setToCache('user', userObject)
        
        this.setState({
            user: userObject
        });
        return userObject;
    };

    handleLogout = async () => {
        Cache.setToCache('user', null);
        Cache.setToCache('Authentication', null);
        localStorage.removeItem("diceHistory");
        localStorage.removeItem("rouletteHistory");
        localStorage.removeItem("flipHistory");
        localStorage.removeItem("plinkoHistory");
        await store.dispatch(setProfileInfo(null));
        this.setState({ user: null });
        window.location.reload();
        window.location.href = '/'
    };

    renderLoginRegisterModal = () => {
        const { registerLoginModalOpen, error } = this.state;
        return registerLoginModalOpen ? (
            <Modal onClose={this.handleRegisterLoginModalClose}>
                <div styleName="modal">
                <div styleName="tabs">
                    <Tabs
                    selected={registerLoginModalOpen}
                    options={[
                        {
                        value: "register",
                        label: "Register"
                        },
                        { value: "login", label: "Login" }
                    ]}
                    onSelect={this.handleTabChange}
                    />
                </div>

                {registerLoginModalOpen === "login" ? (
                    <LoginForm onSubmit={this.handleLogin} error={error} />
                ) : (
                    <RegisterForm onSubmit={this.handleRegister} error={error} />
                )}
                </div>
            </Modal>
        ) : null;
    };

    renderCashierModal = () => {
        const { cashierOpen } = this.state;

        return cashierOpen ? (
            <Modal onClose={this.handleCashierModalClose}>
                <CashierForm onClose={this.handleCashierModalClose} />
            </Modal>
        ) : null;
    };

    updateAppInfo = async () => {
        let app = await getAppInfo();
        let plinko = {_id:"5d98ac6e4470590bcc57a09c",
                        description:"Plinko",
                        edge:10,
                        image_url:"https://storage.googleapis.com/betprotocol-game-images/001-dices.png",
                        isClosed:false,
                        metaName:"plinko_simple",
                        name:"Plinko",
                        resultSpace: [{_id: "5d98ac6e4470590bcc57a026", formType: "1", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a027", formType: "2", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a028", formType: "3", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a029", formType: "4", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a02a", formType: "5", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a02b", formType: "6", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a02c", formType: "7", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a02d", formType: "8", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a02e", formType: "9", probability: 0.01, color: "red"},
                                      {_id: "5d98ac6e4470590bcc57a02f", formType: "10", probability: 0.01, color: "red"}],
                        tableLimit:30
                    }
        app.games.push(plinko);
        Cache.setToCache("appInfo", app);
        this.setState({...this.state, app})
    };

    isGameAvailable = metaName => {
        const appInfo = Cache.getFromCache("appInfo");
        if (!appInfo) return null;
        return find(appInfo.games, { metaName: metaName });
    };


    renderGamePages = ({history}) => {
        return (
            <>
                {this.isGameAvailable("linear_dice_simple") ? (
                    <Route
                    exact
                    path="/linear_dice_simple"
                    render={props => (
                        <DicePage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("coinflip_simple") ? (
                    <Route
                    exact
                    path="/coinflip_simple"
                    render={props => (
                        <FlipPage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("european_roulette_simple") ? (
                    <Route
                    exact
                    path="/european_roulette_simple"
                    render={props => (
                        <RoulettePage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("wheel_simple") ? (
                    <Route
                    exact
                    path="/wheel_simple"
                    render={props => (
                        <WheelPage
                        {...props}
                        game={this.isGameAvailable("wheel_simple")}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                    {this.isGameAvailable("wheel_variation_1") ? (
                    <Route
                    exact
                    path="/wheel_variation_1"
                    render={props => (
                        <WheelVariation1
                            {...props}
                            game={this.isGameAvailable("wheel_variation_1")}
                            onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                    {this.isGameAvailable("plinko_simple") ? (
                    <Route
                    exact
                    path="/plinko_simple"
                    render={props => (
                        <PlinkoPage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
            </>
        )
    }

    render() {
        const { user, app, isLoading } = this.state;
        const { profile, startLoadingProgress, modal } = this.props;

        if (!app || isLoading) {return null};
        const { progress, confirmations } = startLoadingProgress;

        let progress100 = parseInt(progress/confirmations*100);
        let isUserLoaded = (confirmations == progress);
        const { topBar } = getAppCustomization();
        
        return (
                <UserContext.Provider
                    value={{
                        user,
                        setUser: (() => {})
                    }}
                >
                    <LoadingBanner isLoaded={isUserLoaded} progress={progress100}/>
                    <Router history={history}>
                        <Widgets/>
                        <header>
                            <Navbar
                                history={history}
                                onAccount={this.handleAccountOpen}
                                onLogout={this.handleLogout}
                                onLoginRegister={this.handleLoginOrRegisterOpen}
                                onCashier={this.handleCashierOpen}
                            />
                            {this.renderLoginRegisterModal()}
                            {this.renderCashierModal()}
                            <AffiliateWithdrawForm/>
                            <MessageForm user={user}/>
                        </header>
                        <div>
                            <div styleName='top-bars'>
                                <AnnouncementTab topBar={topBar}/>
                                <NavigationBar history={history}/>
                            </div>
                            <Row>
                                <div className='col-lg-10 col-xl-10' styleName='no-padding'>
                                    <div styleName='platform-container'>
                                    <Switch history={history}>
                                        <Route
                                            exact
                                            path="/"
                                            render={props => (
                                                <HomePage
                                                    {...props}
                                                    onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                                                />
                                        
                                            )}
                                        />
                                        <Route
                                            exact
                                            path="/account"
                                            render={props => <AccountPage {...props} />}
                                        />

                                        {this.renderGamePages({history})}
                                    </Switch>
                                    </div>
                                </div>
                                <Col md={4} lg={2} xl={2}>
                                    <div styleName='chat-container-outro'> 
                                        <div styleName={'chat-container'}>
                                            <ChatPage/>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Router>
                </UserContext.Provider>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        startLoadingProgress : state.startLoadingProgress,
        modal : state.modal
    };
}

export default connect(mapStateToProps)(App);
