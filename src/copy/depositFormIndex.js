
    const depositFormIndexCopy =
    {
  "en": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          "Never send other currencies, we are not responsible for any mistake.",
          "Copy",
          "Your Deposit Address is being generated, please wait a few minutes.",
          "Amount"
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
          "Your Deposit Address is being generated, please wait a few minutes.",
          "금액"
        ],
        "FUNC_TEXT": [
          (params) => { return `QR 코드를 스캔하여 ${params[0]}를 전송하십시오. 이 주소에는 ${params[1]} 만 입금 가능합니다.`}
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
          "Your Deposit Address is being generated, please wait a few minutes.",
          "金额"
        ],
        "FUNC_TEXT": [
          (params) => { return `扫描QR码并将${params[0]}转移到其中，仅将${params[1]}存入该地址。`}
        ]
      }
    }
  },
  "jp": {
    "INDEX": {
      "TYPOGRAPHY": {
        "TEXT": [
          "Never send other currencies, we are not responsible for any mistake.",
          "Copy",
          "Your Deposit Address is being generated, please wait a few minutes.",
          "Amount"
        ],
        "FUNC_TEXT": [
          (params) => { return `Scan the QR code and transfer ${params[0]} to it, only deposit ${params[1]} in this address.`}
        ]
      }
    }
  }
}
    export default depositFormIndexCopy;
    