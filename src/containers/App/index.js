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
    MessageForm
} from "components";
import DicePage from "containers/DicePage";
import FlipPage from "containers/FlipPage";
import RoulettePage from "containers/RoulettePage";
import { login, logout, register, getCurrentUser } from "lib/api/users";
import getAppInfo from "lib/api/app";
import handleError from "lib/api/handleError";
import User from "controllers/User/User";
import UserContext from "./UserContext";
import { Row, Col, Container } from 'reactstrap';
import "./index.css";
import Web3 from "web3";
import { setProfileInfo } from "../../redux/actions/profile";
import store from "./store";
import Cache from "../../lib/cache/cache";
import ChatPage from "../Chat";
import gif from "assets/gif.gif";
import ChatChannel from "../../controllers/Chat";
import { CopyText } from "../../copy";
import { setMessageNotification } from "../../redux/actions/message";

const history = createBrowserHistory();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true
        }
    }

    componentDidMount = () => {
        this.asyncCalls();
        this.startChatNoLogged();
    };

    startChatNoLogged = async () => {
        try{
            this.chat = new ChatChannel({id : null, name : null});
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
            console.log(err);
        }
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
                await this.handleLogin({
                    username : cache.username, 
                    password : cache.password
                });
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

    handleTabChange = name => {
        this.setState({ registerLoginModalOpen: name, error: null });
    };

    handleLoginOrRegisterOpen = tab => {
        this.setState({ registerLoginModalOpen: tab });
    };

    handleCashierOpen = () => {
        this.setState({ cashierOpen: true });
    };

    handleLogin = async form => {
        try {
            const response = await login(form);
            Cache.setToCache('Authentication', form)

            if (response.status !== 200) {
                return this.setState({ error: response.status });
            }

            let user = await this.updateUser(response);
            await user.updateUser();

            return this.setState({ registerLoginModalOpen: null, error: null });
        } catch (error) {
            console.log(error)
            return handleError(error);
        }
    };

    handleRegister = async form => {
        try {
            const response = await register(form);
            Cache.setToCache('Authentication', {username : form.username, password : form.password});
            if (response.status !== 200) { return this.setState({ error: response }); }
            let user = await this.updateUser(response);
            await user.updateUser();
            return this.setState({ registerLoginModalOpen: null, error: null });
        } catch (error) {
            console.log(error);
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
            this.chat.__kill__();
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
        await logout();
        await store.dispatch(setProfileInfo(null));
        Cache.setToCache('user', null);
        Cache.setToCache('Authentication', null);
        localStorage.removeItem("diceHistory");
        localStorage.removeItem("rouletteHistory");
        localStorage.removeItem("flipHistory");
        this.setState({ user: null });
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
                <CashierForm />
            </Modal>
        ) : null;
    };


    updateAppInfo = async () => {
        let app = await getAppInfo();
        Cache.setToCache("appInfo", app);
        this.setState({...this.state, app})
    };

    isGameAvailable = game => {
        const appInfo = Cache.getFromCache("appInfo");

        if (!appInfo) return null;

        return find(appInfo.games, { name: game });
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
                {this.isGameAvailable("Linear Dice") ? (
                    <Route
                    exact
                    path="/dice"
                    render={props => (
                        <DicePage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("CoinFlip") ? (
                    <Route
                    exact
                    path="/coinflip"
                    render={props => (
                        <FlipPage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("Roulette") ? (
                    <Route
                    exact
                    path="/roulette"
                    render={props => (
                        <RoulettePage
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

        if (!app) return null;

        if(window.onload){ return( <img src={gif} styleName='gif'/> )}

        return (
                <UserContext.Provider
                    value={{
                        user,
                        setUser: this.updateUser
                    }}
                >
                    <Router history={history}>
                    <header>
                        <Navbar
                            user={user}
                            onLogout={this.handleLogout}
                            onLoginRegister={this.handleLoginOrRegisterOpen}
                            onCashier={this.handleCashierOpen}
                        />
                        {this.renderLoginRegisterModal()}
                        {this.renderCashierModal()}
                        <MessageForm user={user}/>
                    </header>
                    <Row>
                        <Col md={12} lg={9} xl={9}>
                            <main styleName="container">
                                {this.renderPages({history})}
                            </main>
                        </Col>
                        <Col md={4} lg={3} xl={3}>
                            <div styleName='chat-container-outro'> 
                                <div styleName={'chat-container'}>
                                    <ChatPage/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    </Router>
                </UserContext.Provider>
        );
    }
}
