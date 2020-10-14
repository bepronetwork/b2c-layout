import store from '../../containers/App/store';
import { setChatInfo } from '../../redux/actions/chat';
import { StreamChat,  } from 'stream-chat';
import languages from '../../config/languages';
import http from 'http';

 class ChatChannel{
    constructor({id, name, token, publicKey}){
        this.id = id;
        this.channel_id = languages[0].name.toLowerCase();
        this.username = name;
        this.cc = new StreamChat(publicKey, {
            timeout: 3000,
            httpAgent: new http.Agent({ keepAlive: 3000 }),
            httpsAgent: new http.Agent({ keepAlive: 3000 }),
        });
        this.publicKey = publicKey;
        this.token = token;
        this.messages = [];
        this.channelListener = {};
        this.participants = 0;
        this.open = true;
        this.isGuest = !this.token ? true : false;
        this.user = null;
        this.chatName = '';
        this.isWorking = true;
    }

    __init__ = async () => {
        try{
            this.user = await this.connectUser();
            this.channel = await this.enterChannel();
            this.setTimer()
        }catch(err){
            console.log(err)
            this.isWorking = false;
            // Nothing
        }
    }

    kill = async  () => {

    }

    getMessages = () => {
        return this.messages
    }

    changeLanguage = async ({language, channel_id}) => {
        this.language = language;
        this.channel_id = channel_id;
        clearInterval(this.timer);
        this.channel = await this.enterChannel();
        await this.listenChannelUpdates();
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
        this.listenChannelUpdates();
    }

    enterChannel = async () => {
        this.conversation = this.cc.channel('livestream', this.channel_id);
    }

    listenChannelUpdates = async () => {
        // Get Messages
            const conversationState = await this.conversation.watch();
            this.open = true;
            this.chatName = conversationState.channel.id;
            this.participants = conversationState.watcher_count;
            this.messages = conversationState.messages;
            await this.updateReduxState();

            this.conversation.on('message.new', async event => {
                this.participants = event.watcher_count;
                this.messages.push(event.message);

                await this.updateReduxState();
            });
      
    }

    connectUser = async () => {
        if(!this.isGuest){
            await this.cc.setUser(
                {
                    id: this.username
                },   
                this.token
            )
        }else{
            await this.cc.setGuestUser({ id: 'test' });
        }
      
    }

    sendMessage = async ({message, data}) => {
        try{
            return await this.conversation.sendMessage({
                text: message
            });
        }catch(err){
            console.log(err)
        }
       
    }
}


export default ChatChannel;
