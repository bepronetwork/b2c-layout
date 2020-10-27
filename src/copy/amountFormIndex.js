
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
          (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`},
          (params)=>{ return  `Minimum Withdrawal is ${params[0]} ${params[1]}`}
          
        ],
        "NOTICE": [
          "Fee"
        ]
      },
      "DISCLAIMER": {
        "CONFIRM_DESC": "Please ensure the address is not a smart contract address as we currently do not support contract transfer.",
        "CONFIRM": "I understand the Risks and Wish to Continue.",
        "NOTICE": "Notice",
        "LIST" : [
          "Please do not withdraw to the ICO or crowdfunding address",
          "We will process your withdrawal in 30 minutes, it depends on the blockchain when the assets would be finally settled in your withdraw address",
          "Withdrawing directly into another user deposit address is not supported, please use an external address"
        ]
      }
    }
  },
  "kr": {
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
          (params)=>{ return  `최대 출금 가능 금액은 ${params[0]} ${params[1]} 입니다.`},
          (params)=>{ return  `Minimum Withdrawal is ${params[0]} ${params[1]}`}
        ],
        "NOTICE": [
          "Fee"
        ]
      },
      "DISCLAIMER": {
        "CONFIRM_DESC": "Please ensure the address is not a smart contract address as we currently do not support contract transfer.",
        "CONFIRM": "I understand the Risks and Wish to Continue.",
        "NOTICE": "Notice",
        "LIST" : [
          "Please do not withdraw to the ICO or crowdfunding address",
          "We will process your withdrawal in 30 minutes, it depends on the blockchain when the assets would be finally settled in your withdraw address",
          "Withdrawing directly into the another user deposit address is not supported, please use an external address"
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
          (params)=>{ return  `您的最大提币限额为${params[0]} ${params[1]}`},
          (params)=>{ return  `Minimum Withdrawal is ${params[0]} ${params[1]}`}
        ],
        "NOTICE": [
          "Fee"
        ]
      },
      "DISCLAIMER": {
        "CONFIRM_DESC": "Please ensure the address is not a smart contract address as we currently do not support contract transfer.",
        "CONFIRM": "I understand the Risks and Wish to Continue.",
        "NOTICE": "Notice",
        "LIST" : [
          "Please do not withdraw to the ICO or crowdfunding address",
          "We will process your withdrawal in 30 minutes, it depends on the blockchain when the assets would be finally settled in your withdraw address",
          "Withdrawing directly into the another user deposit address is not supported, please use an external address"
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
          (params)=>{ return  `Maximum Withdrawal is ${params[0]} ${params[1]}`},
          (params)=>{ return  `Minimum Withdrawal is ${params[0]} ${params[1]}`}
        ],
        "NOTICE": [
          "Fee"
        ]
      },
      "DISCLAIMER": {
        "CONFIRM_DESC": "Please ensure the address is not a smart contract address as we currently do not support contract transfer.",
        "CONFIRM": "I understand the Risks and Wish to Continue.",
        "NOTICE": "Notice",
        "LIST" : [
          "Please do not withdraw to the ICO or crowdfunding address",
          "We will process your withdrawal in 30 minutes, it depends on the blockchain when the assets would be finally settled in your withdraw address",
          "Withdrawing directly into the another user deposit address is not supported, please use an external address"
        ]
      }
    }
  },
  "ru": {
    "INDEX": {
      "INPUT_TEXT": {
        "PLACEHOLDER": [
          "Адрес"
        ]
      },
      "TYPOGRAPHY": {
        "TEXT": [
          "Ваш адрес создаётся, подождите несколько минут."
        ],
        "FUNC_TEXT": [
          (params)=>{ return `Вы имеете ${params[0]} ${params[1]}`},
          (params)=>{ return  `Максимально доступное количество для вывода составляет ${params[0]} ${params[1]}`},
          (params)=>{ return  `Минимально доступное количество для вывода составляет ${params[0]} ${params[1]}`}
          
        ],
        "NOTICE": [
          "Fee"
        ]
      },
      "DISCLAIMER": {
        "CONFIRM_DESC": "Пожалуйста, убедитесь, что адрес не является адресом смарт-контракта, поскольку в настоящее время мы не взаимодействуем со смарт-контрактами",
        "CONFIRM": "Я понимаю риски и желаю продолжить.",
        "NOTICE": "Комментарии",
        "LIST" : [
          "Пожалуйста, не выводите средства на адрес ICO или краудфандинга",
          "Мы обработаем ваш вывод в течение 30 минут, это зависит от блокчейна, когда активы будут окончательно рассчитаны на ваш адрес для вывода.",
          "Вывод средств напрямую на другой адрес пользователя не поддерживается, используйте внешний адрес"
        ]
      }
    }
  }
}
export default amountFormIndexCopy;
