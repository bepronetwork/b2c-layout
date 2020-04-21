const fs = require('fs');
import { apiUrl, appId } from "../src/lib/api/apiConfig";
import axios from "axios";
import image2base64 from 'image-to-base64';
import { html2json, json2html } from 'html2json';
import { fieldAndChangeFromHTML } from "./helpers";
let indexHtml = fs.readFileSync('scripts/index.html', 'utf8');

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

async function generateHeadElements(){
    /* Get CSS Font Link */

    var html = html2json(indexHtml);
    html = generateNavBarName(html);
    html = generateLicenseNumber(html);

    if(appInfo.hasOwnProperty('typography')){
        const { typography } =  appInfo;
        const { url, name } = typography;
        
        if (url) {
            const fontLink = '{ "node": "element", "tag": "link", "attr": { "href": "' + url + '", "rel": "stylesheet" } }';
            var fontLinkObj = JSON.parse(fontLink);
            html.child[0].child[1].child.push(fontLinkObj);
        }

        const fontName = name ? "$font-family: " + name + ";" : "";

        fs.writeFile("src/styles/serverFonts.css", fontName, () => {
            console.log("Server Fonts Css Written");
        });
    }

    /* If Exists Save */
    fs.writeFileSync("public/index.html", json2html(html), 'utf8');
}

function generateNavBarName(html){
    /* Get NavBar Name */
    const { name } = appInfo;
    const description = appInfo.hasOwnProperty('description') ? appInfo.description : null;
    const navBarName = `${name} - ${description}`;
    let titleIndex = html.child[0].child[1].child.findIndex( c => c.tag && (c.tag.toLowerCase() == 'title'));
    html.child[0].child[1].child[titleIndex].child[0].text = navBarName;
    return html;
}

function generateLicenseNumber(html){
    /* Get NavBar Name */
    const { isValid, licenseID } = appInfo;
    const src = `https://${licenseID}.curacao-egaming.com/ceg-seal.js`;
    if(isValid){
        let titleIndex = html.child[0].child[1].child.findIndex( c => c.tag && (c.tag.toLowerCase() == 'script') && (c.attr && c.attr.id == 'licenseID'));
        html.child[0].child[1].child[titleIndex].attr.src = src;
    }
    return html;
}


async function generateFavIcon(){
    /* Get Favicon */
    const { id } =  appInfo.customization.topIcon;
    if (id) {
        let blob = await image2base64(id) // you can also to use url
        /* If Exists Save */
        fs.writeFileSync("public/logo.ico", blob, 'base64');
    }
}


async function generateLogo(){
    /* Get Logo */
    const { id } =  appInfo.customization.logo;
    if (id) {
        let blob = await image2base64(id) // you can also to use url
        /* If Exists Save */
        fs.writeFileSync("public/logo.png", blob, 'base64');
    }
}

async function generateLoadingGif(){
    /* Get Loading Gif */
    const { id } =  appInfo.customization.loadingGif;
    if (id) {
        let blob = await image2base64(id) // you can also to use url
        /* If Exists Save */
        fs.writeFileSync("public/loading.gif", blob, 'base64');
    }
}

async function setColors(){
    /* Get app Info */
    const { colors } =  appInfo.customization;
    const objectServerInfo = ServerTOJSONMapper({key : 'colors', value : colors});
    fs.writeFile("src/styles/serverVariables.css", JSONtoSASS(objectServerInfo), () => {
        console.log("Server Colors Css Written");
    });
}

(async () => {
    try{
        /* Get App Info */
        appInfo = await getAppInfo();
        /* Set Head Elements */
        await generateHeadElements();
        /* Set Platform Colors */
        await setColors();
        /* Set Platform Favicon */
        await generateFavIcon();
        /* Set Platform Logo */
        await generateLogo();
        /* Set Platform Loading Gif */
        await generateLoadingGif();
    }catch(err){
        console.log(err);
    }

})();

