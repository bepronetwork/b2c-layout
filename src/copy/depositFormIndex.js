
    const depositFormIndexCopy =
    {
  "en": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          "Never send other currencies, we are not responsible for any mistake.",
          "Copy",
          "Your Deposit Address is being generated, please wait a few minutes.",
          "Price"
        ],
        "FUNC_TEXT": [
          (params) => { return `Scan the QR code and transfer ${params[0]} to it, only deposit ${params[1]} in this address.`}
        ],
        "NOTICE_TEXT": [
          (params) => { return `Bonus ${params[0]}% (minimum amount ${params[1]} ${params[2]} and maximum amount ${params[3]} ${params[2]} to qualify)`},
          "Fee"
        ],
        "FREE_TITLE": [
          (params, hourParam, minParam) => { return `You can get ${params[0]} every ${hourParam < 10 ? `0${hourParam}` : hourParam}h:${minParam < 10 ? `0${minParam}` : minParam}min`},
          "Fee"
        ]
      }
    },
    "NOTICE": "Notice"
  },
  "ko": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          `지원하지 않는 토큰을 입금하지 마십시오. 
          지원하지 않는 토큰 입금에 대한 부분은 책임 지지 않습니다.`,
          "복사",
          "Your Deposit Address is being generated, please wait a few minutes.",
          "Price"
        ],
        "FUNC_TEXT": [
          (params) => { return `QR 코드를 스캔하여 ${params[0]}를 전송하십시오. 이 주소에는 ${params[1]} 만 입금 가능합니다.`}
        ],
        "NOTICE_TEXT": [
          (params) => { return `Bonus ${params[0]}% (minimum amount ${params[1]} ${params[2]} and maximum amount ${params[3]} ${params[2]} to qualify)`},
          "Fee"
        ],
        "FREE_TITLE": [
          (params, hourParam, minParam) => { return `You can get ${params[0]} every ${hourParam < 10 ? `0${hourParam}` : hourParam}h:${minParam < 10 ? `0${minParam}` : minParam}min`},
          "Fee"
        ]
      }
    },
    "NOTICE": "Notice"
  },
  "ch": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          `切勿发送其他货币，我们对任何错误概不负责。`,
          "复制",
          "Your Deposit Address is being generated, please wait a few minutes.",
          "Price"
        ],
        "FUNC_TEXT": [
          (params) => { return `扫描QR码并将${params[0]}转移到其中，仅将${params[1]}存入该地址。`}
        ],
        "NOTICE_TEXT": [
          (params) => { return `Bonus ${params[0]}% (minimum amount ${params[1]} ${params[2]} and maximum amount ${params[3]} ${params[2]} to qualify)`},
          "Fee"
        ],
        "FREE_TITLE": [
          (params, hourParam, minParam) => { return `You can get ${params[0]} every ${hourParam < 10 ? `0${hourParam}` : hourParam}h:${minParam < 10 ? `0${minParam}` : minParam}min`},
          "Fee"
        ]
      }
    },
    "NOTICE": "Notice"
  },
  "jp": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          "Never send other currencies, we are not responsible for any mistake.",
          "Copy",
          "Your Deposit Address is being generated, please wait a few minutes.",
          "Price"
        ],
        "FUNC_TEXT": [
          (params) => { return `Scan the QR code and transfer ${params[0]} to it, only deposit ${params[1]} in this address.`}
        ],
        "NOTICE_TEXT": [
          (params) => { return `Bonus ${params[0]}% (minimum amount ${params[1]} ${params[2]} and maximum amount ${params[3]} ${params[2]} to qualify)`},
          "Fee"
        ],
        "FREE_TITLE": [
          (params, hourParam, minParam) => { return `You can get ${params[0]} every ${hourParam < 10 ? `0${hourParam}` : hourParam}h:${minParam < 10 ? `0${minParam}` : minParam}min`},
          "Fee"
        ]
      }
    },
    "NOTICE": "Notice"
  },
  "ru": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          "Никогда не отправляйте другую валюту, мы не несем ответственности за ошибки.",
          "Копировать",
          "Ваш адрес депозита создается, подождите несколько минут.",
          "Цена"
        ],
        "FUNC_TEXT": [
          (params) => { return `Отсканируйте QR-код и отправьте ${params[0]}, внесите точно ${params[1]} на этот адрес.`}
        ],
        "NOTICE_TEXT": [
          (params) => { return `Bonus ${params[0]}% (minimum amount ${params[1]} ${params[2]} and maximum amount ${params[3]} ${params[2]} to qualify)`},
          "Fee"
        ],
        "FREE_TITLE": [
          (params, hourParam, minParam) => { return `You can get ${params[0]} every ${hourParam < 10 ? `0${hourParam}` : hourParam}h:${minParam < 10 ? `0${minParam}` : minParam}min`},
          "Fee"
        ]
      }
    },
    "NOTICE": "Notice"
  }
}
    export default depositFormIndexCopy;
    