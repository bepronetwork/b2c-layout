
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
          "귀하의 주소가 작성 중입니다. 몇 분 정도 기다리십시오."
        ],
        "FUNC_TEXT": [
          (params)=>{ return `You only have ${params[0]} ${params[1]}`},
          (params)=>{ return  `최대 출금 가능 금액은 ${params[0]} ${params[1]} 입니다`}
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
          "您的地址正在创建中，请等待几分钟。"
        ],
        "FUNC_TEXT": [
          (params)=>{ return `You only have ${params[0]} ${params[1]}`},
          (params)=>{ return  `您的最大提币限额为${params[0]} ${params[1]}`}
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