
    const depositFormIndexCopy =
    {
  "en": {
    "INDEX": {
      "TYPOGRAPHY": {
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
  "ko": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          `지원하지 않는 토큰을 입금하지 마십시오. 
          지원하지 않는 토큰 입금에 대한 부분은 책임 지지 않습니다.`,
          "복사",
          "Your Deposit Address is being generated, please wait a few minutes."
        ],
        "FUNC_TEXT": [
          (params) => { return `Scan the QR code and transfer ${params[0]} to it, only deposit ${params[1]} in this address.`}
        ]
      }
    }
  },
  "ch": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          `切勿发送其他货币，我们对任何错误概不负责。`,
          "复制",
          "Your Deposit Address is being generated, please wait a few minutes."
        ],
        "FUNC_TEXT": [
          (params) => { return `Scan the QR code and transfer ${params[0]} to it, only deposit ${params[1]} in this address.`}
        ]
      }
    }
  },
  "jp": {
    "INDEX": {
      "TYPOGRAPHY": {
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
  }
}
    export default depositFormIndexCopy;
    