import english  from "../assets/languages/english.png";
import chinese  from "../assets/languages/chinese.png";
import korea   from "../assets/languages/korea.png";
import japan   from "../assets/languages/japan.png";

const languages = [
    {
        name : 'English',
        image : english,
        nick : 'en',
        channel_id : 'english'
    },
    {
        name : 'Chinese',
        nick : 'ch',
        image : chinese,
        channel_id : 'chinese'
    },
    /*{
        name : 'Korean',
        nick : 'ko',
        image : korea,
        channel_id : 'korea'
    }, */
    {
        name : 'Japanese',
        nick : 'jp',
        image : japan,
        channel_id : 'japanese'
    } 
]


export default languages;