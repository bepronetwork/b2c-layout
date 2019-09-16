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
    AccountInfoModal,
    CashierForm,
    LoadingBanner,
    MessageForm
} from "components";
import DicePage from "containers/DicePage";
import FlipPage from "containers/FlipPage";
import RoulettePage from "containers/RoulettePage";
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
import ChatChannelUnlogged from "../../controllers/Chat/ChatUnlogged";
import WheelPage from "../WheelPage";
import { connect } from 'react-redux';
import _ from 'lodash';
import { setStartLoadingProcessDispatcher } from "../../lib/redux";
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
    };

    start = () => {
        this.setState({...this.state, isLoading : false})
    }

    startChatNoLogged = async () => {
        try{
            this.chat = new ChatChannelUnlogged({id : null, name : null});
            await this.chat.__initNotLogged__();
        }catch(err){
            console.log(err)
        }
    }

	asyncCalls = async () => {
        try{
            this.startWallet();
            await this.loginAccount();
        }catch(err){
            setStartLoadingProcessDispatcher(6);
            this.startChatNoLogged();
        }
        this.start();
    }

    loginAccount = async () => {
        // Get App Ino
        Cache.setToCache("appInfo", null);
        const appInfo = Cache.getFromCache("appInfo");

        if (!appInfo) {
            await this.updateAppInfo();
        }else{
            this.setState({...this.state, app : appInfo});
        }

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

    handleAccountOpen = () => {
        this.setState({ accountInfoOpen: true });
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
            await this.chat.__kill__();
            this.chat = null;
        }

        const appInfo = this.state.app;

        let userObject = new User({
            platformAddress: appInfo.platformAddress,
            tokenAddress: appInfo.platformTokenAddress,
            decimals: appInfo.decimals,
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
        await store.dispatch(setProfileInfo(null));
        this.setState({ user: null });
        window.location.reload();
    };

    renderLoginRegisterModal = () => {
        const { registerLoginModalOpen, error } = this.state;
        console.log(error);
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

    renderAccountInfoModal = () => {
        const { accountInfoOpen } = this.state;

        return accountInfoOpen ? (
            <Modal onClose={this.handleAccountModalClose}>
                <AccountInfoModal />
            </Modal>
        ) : null;
    };


    updateAppInfo = async () => {
        let app = await getAppInfo();
        Cache.setToCache("appInfo", app);
        this.setState({...this.state, app})
    };

    isGameAvailable = metaName => {
        const appInfo = Cache.getFromCache("appInfo");
        if (!appInfo) return null;
        return find(appInfo.games, { metaName: metaName });
    };


    renderPages = ({history}) => {
        return (
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
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
            </Switch>
        )
    }

    render() {
        const { user, app, isLoading } = this.state;
        const { profile, startLoadingProgress } = this.props;

        if (!app || isLoading) {return null};
        const { progress, confirmations } = startLoadingProgress;

        let progress100 = parseInt(progress/confirmations*100);
        let isUserLoaded = (confirmations == progress);
        
        
        return (
                <UserContext.Provider
                    value={{
                        user,
                        setUser: (() => {})
                    }}
                >
                    <LoadingBanner isLoaded={isUserLoaded} progress={progress100}/>
                    <Router history={history}>
                    <header>
                        <Navbar
                            onAccount={this.handleAccountOpen}
                            onLogout={this.handleLogout}
                            onLoginRegister={this.handleLoginOrRegisterOpen}
                            onCashier={this.handleCashierOpen}
                        />
                        {this.renderAccountInfoModal()}
                        {this.renderLoginRegisterModal()}
                        {this.renderCashierModal()}
                        <MessageForm user={user}/>
                    </header>
                    <div>
                        <Row>
                            <div className='col-lg-10 col-xl-10' styleName='no-padding'>
                                <div styleName='platform-container'>
                                    {this.renderPages({history})}
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
        startLoadingProgress : state.startLoadingProgress
    };
}

export default connect(mapStateToProps)(App);
