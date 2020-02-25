
    const amountFormIndexCopy =
    {
  "en": {
    "INDEX": {
      "INPUT_TEXT": {
        "PLACEHOLDER": [
          "Address"
        ]
      },
      "TYPOGRAPHY": {
        "TEXT": [
          "Your Address is being created, wait a few minutes."
        ],
        "FUNC_TEXT": [
          (params)=>{ return `You only have ${params[0]} ${params[1]}`},
          (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`}
        ]
      }
    }
  },
  "ko": {
    "INDEX": {
      "INPUT_TEXT": {
        "PLACEHOLDER": [
          "주소"
        ]
      },
      "TYPOGRAPHY": {
        "TEXT": [
          "Your Address is being created, wait a few minutes."
        ],
        "FUNC_TEXT": [
          (params)=>{ return `You only have ${params[0]} ${params[1]}`},
          (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`}
        ]
      }
    }
  },
  "ch": {
    "INDEX": {
      "INPUT_TEXT": {
        "PLACEHOLDER": [
          "地址"
        ]
      },
      "TYPOGRAPHY": {
        "TEXT": [
          "Your Address is being created, wait a few minutes."
        ],
        "FUNC_TEXT": [
          (params)=>{ return `You only have ${params[0]} ${params[1]}`},
          (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`}
        ]
      }
    }
  },
  "jp": {
    "INDEX": {
      "INPUT_TEXT": {
        "PLACEHOLDER": [
          "Address"
        ]
      },
      "TYPOGRAPHY": {
        "TEXT": [
          "Your Address is being created, wait a few minutes."
        ],
        "FUNC_TEXT": [
          (params)=>{ return `You only have ${params[0]} ${params[1]}`},
          (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`}
        ]
      }
    }
  }
}
export default amountFormIndexCopy;