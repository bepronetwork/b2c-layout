import store from '../../containers/App/store';
import { setChatInfo } from '../../redux/actions/chat';
import ChatCamp from 'chatcamp';
import languages from '../../config/languages';

const APP_ID = '6551851573570433024';

class ChatChannelUnlogged{
    constructor({id, name}){
        this.id = id;
        this.channel_id = languages[0].channel_id;
        this.name = name;
        this.cc = new ChatCamp({ appId: APP_ID });
        this.messages = [];
        this.channelListener = {};
        this.participants = 0;
        this.open = true;
        this.user = null;
        this.chatName = '';
        this.isWorking = true;
    }

    __init__ = async () => {
        try{
            this.user = await this.connectUser();
            await this.updateUser();
            this.channel = await this.enterChannel();
            this.setTimer()
        }catch(err){
            this.isWorking = false;
            console.log(err)
            // Nothing
        }
    }

    __initNotLogged__ = async () => {
        try{
            this.id = 'user-' + new String(Math.random()*10000/2342*Math.random()).toString();
            this.name = 'user-' + new String(Math.random()*10000/2342*Math.random()).toString();
            this.user = await this.connectUser();
            this.channel = await this.enterChannel();
            this.setTimer()
        }catch(err){
            this.isWorking = false;
            console.log(err)
            // Nothing
        }
    }

    __kill__ = async  () => {
        this.user = null;
        await this.leaveChannel()
        clearInterval(this.timer);
        this.timer = null;
    }

    getMessages = () => {
        return this.messages
    }

    changeLanguage = async ({language, channel_id}) => {
        this.language = language;
        this.channel_id = channel_id;
        clearInterval(this.timer);
        this.channel = await this.enterChannel();
        this.setTimer();
    }

    updateReduxState = async () => {
        if(this.isWorking){
            await store.dispatch(setChatInfo({
                name            : this.chatName,
                participants    : this.participants,
                open            : this.open,
                messages        : this.messages
            }));
        }
    }

    setTimer = () => {
        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval( () => {
            this.listenChannelUpdates();
        }, 1000) /* each 1 sec */
    }

    enterChannel = async () => {
        return new Promise( (resolve, reject) => {
            this.cc.OpenChannel.get(this.channel_id, async (error, openChannel) => {
                if(error){reject(error)}
                this.open = openChannel.isActive;
                this.chatName = openChannel.name;
                this.participants = openChannel.participantsCount;
                openChannel.join(function(error) {
                    if(!error){
                }});
                await this.updateReduxState()
                resolve(openChannel); 
            })
        })  
    }

    listenChannelUpdates = async () => {
        // Get Messages
        let previousMessageListQuery = this.channel.createPreviousMessageListQuery();
        previousMessageListQuery.setLimit(30);
        previousMessageListQuery.setSortBy('INSERTED_AT');

        previousMessageListQuery.load( async (error, messages) => {
            let messagesSorted = messages.sort((a, b) => a.insertedAt - b.insertedAt )
            if (error) { return;}
            this.messages = messagesSorted;
            await this.updateReduxState();
        });
    }

    leaveChannel = () => {
        return new Promise( (resolve, reject) => {
            this.cc.OpenChannel.get(this.channel_id, (error, openChannel) => {
                openChannel.leave( (error) =>  {
                    if (error) { reject(error); }
                    resolve(openChannel); 
                })
            })
        })
    }

    connectUser = async () => {
        return new Promise( (resolve, reject) => {
            this.cc.connect(this.id, (error, user) => {
                if (error) { reject(error); }
                resolve(user); 
            });
        });
    }

    updateUser = async () => {
        try{
            return new Promise( (resolve, reject) => {
                this.cc.updateUserDisplayName(this.name, (error, user) => {
                    if (error) { reject(error); }
                    resolve(user); 
                });
            });
        }catch(err){
            console.log(err);
        }
    }
   

    sendMessage = async ({message, data}) => {
        try{
            return new Promise( (resolve, reject) => {
                this.channel.sendMessage(message, (message, error) => {
                    console.log(message, error);
                    if (error) { reject(error); }
                    this.listenChannelUpdates();
                    resolve(message);
                });
            })
        }catch(err){
            console.log(err)
        }
       
    }
}


export default ChatChannelUnlogged;