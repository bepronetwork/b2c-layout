
    const depositFormIndexCopy = {
        'en' : {
            "INDEX": {"TYPOGRAPHY":{
                "TEXT": [
                    "Neve send other currencies, we are not responsible for any mistake.",
                    "Copy",
                    "Your Deposit Address is being generated, please wait a few minutes."
                ],
                "FUNC_TEXT": [
                    (params) => { return `Scan the QR code and transfer ${params[0]} to it, only deposit ${params[1]} in this address.`}
                ]
            }
        }
    },
        'ko' : {"INDEX":{"TYPOGRAPHY":{"TEXT":["Not Translated","Not Translated","Not Translated"]}}},
        'ch' : {"INDEX":{"TYPOGRAPHY":{"TEXT":["Not Translated","Not Translated","Not Translated"]}}},
        'jp' : {"INDEX":{"TYPOGRAPHY":{"TEXT":["Not Translated","Not Translated","Not Translated"]}}}
    }
    export default depositFormIndexCopy;