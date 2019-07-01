import SendBird from 'sendbird';
import { sendbirdAppID, sendbirdChannelID } from '../../lib/api/apiConfig';
import store from '../../containers/App/store';
import { setChatInfo } from '../../redux/actions/chat';


class ChatChannel{
    constructor({id, name}){
        this.id = id;
        this.name = name;
        this.sendbird = new SendBird({appId: sendbirdAppID});
        this.messages = [];
        this.participants = 0;
        this.open = true;
    }

    __init__ = async () => {
        try{
            this.user = await this.connectUser();
            await this.updateUser();
            this.channel = await this.enterChannel();
            this.setTimer()
        }catch(err){
            // Nothing
        }
    }

    __initNotLogged__ = async () => {
        try{
            this.id = 'none';
            this.user = await this.connectUser();
            this.channel = await this.enterChannel();
            this.setTimer()
        }catch(err){
            // Nothing
        }
    }

    __kill__ = () => {
        this.timer = null;
    }

    getMessages = () => {
        return this.messages
    }

    updateReduxState = async () => {
        await store.dispatch(setChatInfo({
            participants    : this.participants,
            open            : this.open,
            messages        : this.messages
        }));
    }

    setTimer = () => {
        this.timer = setInterval( () => {
            this.listenChannelUpdates();
        }, 1000) // each 1 sec
    }

    enterChannel = async () => {
        return new Promise( (resolve, reject) => {
            this.sendbird.OpenChannel.getChannel(sendbirdChannelID, async (openChannel, error) => {
                this.open =  (openChannel.channelType == 'open')
                await this.updateReduxState()
                if (error) { reject(error); }
                openChannel.enter(function(response, error) {
                    resolve(openChannel);
                    if (error) { reject(error); }
                })
            });
        })  
    }

    listenChannelUpdates = async () => {
        // Get Messages
        var messageListQuery = this.channel.createPreviousMessageListQuery();
        messageListQuery.limit = 30;
        messageListQuery.reverse = false;
        
        messageListQuery.load( async (messageList, error) =>  {
            if (error) { return;}
            this.messages = messageList;
            await this.updateReduxState();
        });
        
        // Get Participants
        var participantListQuery = this.channel.createParticipantListQuery();

        participantListQuery.next( async (participantList, error) => {
            if (error) {return;}
            this.participants = participantList.length;
            await this.updateReduxState();
        });
    }

    connectUser = async () => {
        return new Promise( (resolve, reject) => {
            this.sendbird.connect(this.id, (user, error) => {
                if (error) { reject(error); }
                resolve(user); 
            });
        });
    }

    updateUser = async () => {
        return new Promise( (resolve, reject) => {
            this.sendbird.updateCurrentUserInfo(this.name, null, (response, error) => {
                if (error) { reject(error); }
                resolve(response); 
            });
        });
    }
   

    sendMessage = async ({message, data}) => {
        return new Promise( (resolve, reject) => {
            this.channel.sendUserMessage(message, (message, error) => {
                if (error) { reject(error); }
                this.listenChannelUpdates();
                resolve(message);
            });
        })
    }
}


export default ChatChannel;