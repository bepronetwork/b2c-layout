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
                const { theme } =  appInfo.customization;
                var colors = [];
                var serverColors =  Object.keys(serverJSON.value).map( k => {
                    var hslColorEl = hexToHsl(serverJSON.value[k].hex);
                    var hslColor = "hsl(" + parseInt(hslColorEl.h) + "," + parseInt(hslColorEl.s) + "%," + parseInt(hslColorEl.l) + "%)";
                    var fibonacci = [2, 3, 5, 8, 13];

                    fibonacci.map( f => {
                        /*var darkColor = { object : 'variable', key : serverJSON.value[k].type+"-dark-"+f, value : hslToLightOrDark(hslColorEl.h, hslColorEl.s, hslColorEl.l, f*-1) };
                        darkLightColors.push(darkColor);
    
                        var lightColor = { object : 'variable', key : serverJSON.value[k].type+"-light-"+f, value : hslToLightOrDark(hslColorEl.h, hslColorEl.s, hslColorEl.l, f) };
                        darkLightColors.push(lightColor);*/

                        var color = { object : 'variable', key : serverJSON.value[k].type+"-"+f, value : hslToLightOrDark(hslColorEl.h, hslColorEl.s, hslColorEl.l, theme === "dark" ? f : f*-1 ) };
                        colors.push(color);
                    });

                    var color = { object : 'variable', key : serverJSON.value[k].type+"-dark-3", value : hslToLightOrDark(hslColorEl.h, hslColorEl.s, hslColorEl.l, -3) };
                    colors.push(color);

                    return {
                        object : 'variable',
                        key : serverJSON.value[k].type,
                        value : hslColor
                    }
                });
                return serverColors.concat(colors);
            }
            case 'theme' : {
                var fontColors = [];
                const theme = serverJSON.value;

                if (theme === 'light') {
                    const darkColor = { object : 'variable', key : 'white', value : '#333333'}
                    fontColors.push(darkColor)
                    const lightColor = { object : 'variable', key : 'grey', value : '#4D4D4D'}
                    fontColors.push(lightColor)
                    const shadowColor = { object : 'variable', key : 'shadowColor', value : '#CCCCCC'}
                    fontColors.push(shadowColor)
                }
                else if (theme === 'dark') {
                    const darkColor = { object : 'variable', key : 'white', value : '#FFFFFF'}
                    fontColors.push(darkColor)
                    const lightColor = { object : 'variable', key : 'grey', value : '#CCCCCC'}
                    fontColors.push(lightColor)
                    const shadowColor = { object : 'variable', key : 'shadowColor', value : '#0000006b'}
                    fontColors.push(shadowColor)
                }

                return fontColors;
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

function hexToHsl(hex) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + h[2];
      b = "0x" + hex[3] + hex[3];
    // 6 digits
    } else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }

    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    // Red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
      
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
  
    // Calculate lightness
    l = (cmax + cmin) / 2;
  
    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    var hsl = { "h" : h, "s" : s, "l" : l };
  
    return hsl;
}
  

function hslToLightOrDark(h, s, l, f) {
    l = l + f;

    if (l > 100) {
        l = 100;
    }
    else if (l < 0) {
        l = 0;
    }

    return "hsl(" + parseInt(h) + "," + parseInt(s) + "%," + parseInt(l) + "%)";
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

async function setFontColors(){
    /* Get app Info */
    const { theme } =  appInfo.customization;
    const objectServerInfo = ServerTOJSONMapper({key : 'theme', value : theme});
    fs.writeFile("src/styles/serverVariables.css", JSONtoSASS(objectServerInfo)+ "\n\n", () => {
        console.log("Server Font Colors Css Written");
    });
}

async function setColors(){
    /* Get app Info */
    const { colors } =  appInfo.customization;
    const objectServerInfo = ServerTOJSONMapper({key : 'colors', value : colors});
    fs.appendFile("src/styles/serverVariables.css", JSONtoSASS(objectServerInfo), () => {
        console.log("Server Colors Css Written");
    });
}

(async () => {
    try{
        /* Get App Info */
        appInfo = await getAppInfo();
        /* Set Head Elements */
        await generateHeadElements();
        /* Set Platform Font Colors */
        await setFontColors();
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

