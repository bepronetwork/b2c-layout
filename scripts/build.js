const fs = require('fs');
import { apiUrl, appId } from "../src/lib/api/apiConfig";
import axios from "axios";
import image2base64 from 'image-to-base64';

var appInfo;

/* Get App Info */
async function getAppInfo() {
    try {
        const response = await axios.post(`${apiUrl}/api/app/get`, {
            app: appId
        });
        return response.data.data.message;
    } catch (error) {
        console.log(error)
    }
}

/* HELPERS */

function JSONtoSASS(json){
    let string = '';
    json.map( key => {
        switch(key.object){
            /* It is a variable */
            case 'variable' : {
                string += `\n$${key.key}: ${key.value};`
            }
            /* Add more Types here..*/
        }
        
    })
    return string;
}

function ServerTOJSONMapper(serverJSON){
    return Object.keys(serverJSON).map( key => {
        switch(serverJSON[key]){
            /* Colors */
            case 'colors' : {
                return Object.keys(serverJSON.value).map( k => {
                    return {
                        object : 'variable',
                        key : serverJSON.value[k].type,
                        value : serverJSON.value[k].hex
                    }
                })
            }
            /* Add more Types here..*/
        }
    })[0]
}

/* FUNCTIONS TO BUILD */

async function generateFavIcon(){
    /* Get Logo */
    const { id } =  appInfo.customization.logo;
    let blob = await image2base64(id) // you can also to use url
    /* If Exists Save */
    fs.writeFileSync("public/logo.ico", blob, 'base64');
}


async function generateLogo(){
    /* Get Logo */
    const { id } =  appInfo.customization.logo;
    let blob = await image2base64(id) // you can also to use url
    /* If Exists Save */
    fs.writeFileSync("public/logo.png", blob, 'base64');
}

async function setColors(){
    /* Get app Info */
    const { colors } =  appInfo.customization;
    const objectServerInfo = ServerTOJSONMapper({key : 'colors', value : colors});
    fs.writeFile("src/styles/serverVariables.css", JSONtoSASS(objectServerInfo), () => {
        console.log("done")
    });
}

(async () => {
    /* Get App Info */
    appInfo = await getAppInfo()
    /* Set Platform Colors */
    await setColors();
    /* Set Platform Favicon */
    await generateFavIcon();
    /* Set Platform Icon */
    await generateLogo();

})();

