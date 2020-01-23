import React, { Component } from "react";
import { Modal, Typography, HorizontalStepper } from "components";
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import Security2FASingleton from '../../lib/security/2FA';
import Input2FA from './Input2FA';
import store from "../../containers/App/store";
import { setModal } from "../../redux/actions/modal";
import { set2FA } from "../../redux/actions/set2FA";
import info from 'assets/info.png';
import _ from 'lodash';
import "./index.css";

class Authentication2FAModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    onClose = async () => {
        this.setState({...this.state, error : null});
        await store.dispatch(setModal({key : 'Authentication2FAModal', value : false}));
    }

    set2FAAuthenticator = async ({token}) => {
        const { profile } = this.props;
        const { auth_2fa } = this.state;
        const secret = auth_2fa.secret;

        try {
            let verified = Security2FASingleton.isVerifiedToken2FA( { secret, token } );
            if (!verified) { 
                const error = "Token is Wrong";
                this.setState({...this.state,
                    error
                }) 
                return false;
            }

            let res = await profile.set2FA({
                token, secret
            })

            if (res.data.status === 200) {
                await store.dispatch(set2FA({isActive : true}));
            }
            else {
                const error = "Token is Wrong";
                this.setState({...this.state,
                    error
                }) 
                return false;
            }

            this.onClose();
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

    onChange = (e) => {
        this.setState({...this.state, input : e});
    }

    projectData = async (props) => {
        const { profile } = props;

        if(!profile || _.isEmpty(profile)){return}
        if(_.isEmpty(profile.user_id)){return}
        let auth_2fa = this.state.auth_2fa;

        if(_.isEmpty(auth_2fa)){
            let res = Security2FASingleton.generateSecret2FA({name : 'BetProtocol', account_id : profile.user_id});
            auth_2fa = {
                uri : decodeURIComponent(res.uri),
                secret : res.secret
            }
        }
        this.setState({...this.state,
            auth_2fa
        })     
    }

    render() {
        const { modal } = this.props;
        const { auth_2fa, error } = this.state;
        if(!modal.Authentication2FAModal){ return null };
        return (    
            <Modal onClose={this.onClose}>
                <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                    <div >
                        <Typography variant='h4' color={"grey"}> 2FA Authentication </Typography>
                    </div>
                    <div styleName='root'>
                        <div styleName="content">
                            <HorizontalStepper 
                                alertCondition={!_.isEmpty(error)}
                                alertIcon={info}
                                alertMessage={error}
                                showStepper={false}
                                steps={[
                                    {
                                        label : "Scan",
                                        title : 'Install Google Authenticator and Scan the Below QR Code',
                                        first : true,
                                        condition : true,
                                        content : <div styleName="qrcode"><QRCode value={auth_2fa.uri} /></div>
                                    },
                                    {
                                        label : "Code",
                                        title : 'Insert the Code that Appears in the Auth App',
                                        condition : true,
                                        content : <div styleName="token2FA"><Input2FA secret={`secret`} confirm={this.set2FAAuthenticator}/></div>,
                                        last : true,
                                        closeStepper : this.onClose
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        modal : state.modal,
        set2FA : state.set2FA
    };
}

export default connect(mapStateToProps)(Authentication2FAModal);
