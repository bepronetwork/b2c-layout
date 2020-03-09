const CSS_MODULE_LOCAL_IDENT_NAME = "[local]___[hash:base64:5]";
const { POSTCSS_MODES } = require("@craco/craco");


module.exports = function({env}){
    return {
        style: {
            css: {
                loaderOptions: (cssLoaderOptions, { env, paths }) => {
                    cssLoaderOptions.modules = true;
                    cssLoaderOptions.localIdentName = CSS_MODULE_LOCAL_IDENT_NAME;
                    return cssLoaderOptions;
                }
            },
            postcss: {
                mode: POSTCSS_MODES.file
            }
        },
        babel: {
            plugins: [
                [
                    "babel-plugin-react-css-modules",
                    {
                        generateScopedName: CSS_MODULE_LOCAL_IDENT_NAME,
                        attributeNames: { activeStyleName: "activeClassName" }
                    }
                ]
            ]
        },
        plugins: [
            {
                plugin: "craco-plugin-react-hot-reload",
            }
        ]
    }
};
