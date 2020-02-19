
    const amountFormIndexCopy = {
        'en' : {"INDEX":{
            "INPUT_TEXT":{
                "PLACEHOLDER":[
                    "Address"
                ]
            },
            "TYPOGRAPHY":{
                "TEXT": [
                    "Your Address is being created, wait a few minutes."
                ],
                "FUNC_TEXT": [
                    (params)=>{ return `You only have ${params[0]} ${params[1]}`},
                    (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`}
                ],
            }
        }
    },
        'ko' : {"INDEX":{"INPUT_TEXT":{"PLACEHOLDER":["Not Translated"]},"TYPOGRAPHY":{"TEXT":["Not Translated"]}}},
        'ch' : {"INDEX":{"INPUT_TEXT":{"PLACEHOLDER":["Not Translated"]},"TYPOGRAPHY":{"TEXT":["Not Translated"]}}},
        'jp' : {"INDEX":{"INPUT_TEXT":{"PLACEHOLDER":["Not Translated"]},"TYPOGRAPHY":{"TEXT":["Not Translated"]}}}
    }
    export default amountFormIndexCopy;